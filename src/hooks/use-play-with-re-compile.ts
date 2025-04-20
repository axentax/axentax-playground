import { useDispatch, useSelector } from "react-redux";
import store, { RootState } from "../store/store";
import { ConductStore } from "../conduct/conduct-store";
import { PlayStatusEN, setPlayStatus } from "../store/slice-play-status";
import { CompileWorkerExecutor } from "../worker-brancher/compile-worker-executer";
import { EditorInstanceStore } from "../editor/editor-instance-store";
import { ConvertToObj } from "axentax-compiler";
import { XSynth } from "../synth/x-synth";
import { updatePlayRegion } from "../store/slice-play-region";
import { EditorControl } from "../editor/editor-control";


export const usePlayWithReCompile = (
  playCB: () => void,
  stopCB: () => void
) => {

  const dispatch = useDispatch();
  const syntaxError = useSelector((state: RootState) => state.syntaxError.info);

  const reCompilePlayCB = () => {
    if (syntaxError) return;

    stopCB();
    dispatch(setPlayStatus(PlayStatusEN.COMPILE));

    // 現在カーソル
    const cursorLine = store.getState().cursorLocation.line;

    // コンパイル
    CompileWorkerExecutor.getInstance().setMessage({
      id: 1,
      hasStyleCompile: true,
      hasMidiCompile: true,
      syntax: EditorInstanceStore.getEditor().editor.getValue()
    }, (elm: ConvertToObj) => {

      if (elm.error) {
        // 稀だが、エラーの場合、状態のみ修正
        // ※"誤入力"から"edit-observer側でエラー検知するまで"の一瞬の隙間でplayされた場合
        dispatch(setPlayStatus(PlayStatusEN.STOP));
        return;
      }
      if (!elm.response) return;

      // style用の追加TabObjは除外
      elm.response.mixesList.forEach(mixes => mixes.flatTOList = mixes.flatTOList.filter(to => to.bpm > 0));

      // versionセット
      ConductStore.setVersionOfEditToPlay();
      ConductStore.setPlayingSyntax(EditorInstanceStore.getEditor().editor.getValue());

      // conductセット
      ConductStore.setPlayObj(elm.response);
      // play状態変更
      dispatch(setPlayStatus(PlayStatusEN.STOP));
      // midiファイルセット
      XSynth.getInstance().setMidiFile(elm.midi);
      ConductStore.setPlayingMidi(elm.midi);

      // cursor位置のregionから再生
      const dual0RegionList = elm.response.mixesList[0].regionList;
      for (let ri = dual0RegionList.length - 1; ri >= 0; ri--) {
        if (dual0RegionList[ri].start.line <= cursorLine) {
          XSynth.getInstance().setSeek(ri === 0 ? 0 : dual0RegionList[ri].startLayerTick);
          playCB();
          return;
        }
      }

      dispatch(updatePlayRegion(dual0RegionList[0]));
      XSynth.getInstance().setSeek(0);
      EditorControl.jumpToLine(0);
      playCB();

      return;

    });
  }

  return { reCompilePlayCB }
}
