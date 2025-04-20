import { useCallback } from "react"
import store from "../store/store"
import { ConvertToObj } from "axentax-compiler"
import { useDispatch } from "react-redux"
import { PlayStatusEN, setPlayStatus } from "../store/slice-play-status"
import { XSynth } from "../synth/x-synth"
import { updatePlayBPM } from "../store/slice-play-bpm"
import { EditorInstanceStore } from "../editor/editor-instance-store"
import { CompileCallbackProps } from "../interfaces/compile-callback"
import { CompileWorkerExecutor } from "../worker-brancher/compile-worker-executer"
import { ConductStore } from "../conduct/conduct-store"
import { EditorControl } from "../editor/editor-control"

export const usePlayObserver = (): CompileCallbackProps => {
  const dispatch = useDispatch();

  /**
   * 停止
   */
  const stopCB = useCallback(() => {
    XSynth.getInstance().stop();
  }, []);

  /**
   * 再生
   */
  const playCB = useCallback(() => {

    // エラー中の場合何もしない
    if (store.getState().syntaxError.info) {
      return;
    }

    // syntaxVersionが異なればコンパイル
    const syntaxMatch = store.getState().syntaxMatchVersion.matched;
    if (!syntaxMatch) {

      // 再生状態変更と、syntaxバージョンを一致させる
      ConductStore.setVersionOfEditToPlay();

      dispatch(setPlayStatus(PlayStatusEN.COMPILE));

      // compile with play
      CompileWorkerExecutor.getInstance().setMessage({
        // id: 1,
        hasStyleCompile: true,
        hasMidiCompile: true,
        syntax: EditorInstanceStore.getEditor().editor.getValue()
      }, (res: ConvertToObj) => {

        if (res.error) {
          // 稀だが、エラーの場合、状態のみ修正
          // ※"誤入力"から"edit-observer側でエラー検知するまで"の一瞬の隙間でplayされた場合
          dispatch(setPlayStatus(PlayStatusEN.STOP));
          return;
        }
        if (!res.response) return;

        // style用の追加TabObjは除外
        res.response.mixesList.forEach(mixes => mixes.flatTOList = mixes.flatTOList.filter(to => to.bpm > 0));
        
        // conductOfCurrentPlaying.current = res.response;
        ConductStore.setPlayObj(res.response);
        ConductStore.setPlayingSyntax(EditorInstanceStore.getEditor().editor.getValue());

        const startBPM = res.response.mixesList[0].flatTOList[0]?.bpm || res.response.settings.style.bpm;
        if (startBPM) dispatch(updatePlayBPM(startBPM));
        // XSynth.getInstance().play(res.midi, () => {
        //   EditorControl.clearAllPlaySymDecoration();
        // });
        XSynth.getInstance().play(res.midi, () => {})

      });

    } else {
      // バージョン一致で無条件に再生
      XSynth.getInstance().play(null, () => {
        EditorControl.clearAllPlaySymDecoration();
      });
    }
  }, []);

  return { playCB, stopCB }
}
