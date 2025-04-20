import { useRef } from "react"
import { Conduct, ConvertToObj } from "axentax-compiler";

import store from '../store/store';
import { removeSyntaxError, setSyntaxError } from "../store/slice-syntax-error";
import { XViewUtils } from "../utils/utils";
import { EditorInstanceStore } from "../editor/editor-instance-store";
import { EditorControl } from "../editor/editor-control";
import { CompileWorkerExecutor } from "../worker-brancher/compile-worker-executer";
import { ConductStore } from "../conduct/conduct-store";
import { useDispatch } from "react-redux";
import { updateFileProp } from "../store/file-state/slice-file-prop";
import { updateSystemState } from "../store/status-of-settings/slice-system-status";


export const useEditObserver = (refreshLocationCB: (conduct?: Conduct) => void) => {
  const dispatch = useDispatch();

  const calmSyntaxState = useRef<string>('');
  const timerRef = useRef<number | null>(null);

  /**
   * editor変更検知
   */
  const editedCB = () => {

    // ファイル未保存
    dispatch(updateFileProp({
      isSaved: false
    }))

    // 装飾解除
    EditorControl.clearAllPlaySymDecoration();

    // compose解除
    store.dispatch(updateSystemState({ key: 'existAnnotationCompose', value: false }))

    // syntax取得
    const syntax = EditorInstanceStore.getEditor().editor.getValue();

    // 空白など無視する実装だが、viewModelと差異が発生してしまう /* */のコメントも同じ // だけならいいかも
    // not diff syntax
    const culmSyntax = XViewUtils.removeUnnecessaryInitials(syntax); //.replace(/\s+/gs, ' ');
    if (calmSyntaxState.current === culmSyntax) return;
    calmSyntaxState.current = culmSyntax;

    // playingがあれば比較（UNDO/REDOサポート）
    if (ConductStore.comparisonPlayingSyntax(culmSyntax)) {
      // 一致した場合、バージョンを合わせる。コンパイル処理自体は実施する
      ConductStore.setVersionOfEditToPlay();
    } else {
      // change detection syntax
      ConductStore.incrementEditVersion();
    }

    if (timerRef.current !== null) {
      // debounce
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // コンパイル送信
    timerRef.current = window.setTimeout(() => {
      CompileWorkerExecutor.getInstance().setMessage({
        // id: 1,
        hasStyleCompile: false,
        hasMidiCompile: false,
        syntax: EditorInstanceStore.getEditor().editor.getValue()
      }, (res: ConvertToObj) => {
        // response
        const currentError = store.getState().syntaxError;
        if (res.error) {
          // 差分があれば syntax-error 更新
          if (
            res.error.message !== currentError.info?.message
            || res.error.line !== currentError.info?.line
            || res.error.linePos !== currentError.info?.linePos
            || res.error.token !== currentError.info?.token
          ) {
            store.dispatch(removeSyntaxError());
            EditorControl.clearErrorDecoration();

            store.dispatch(setSyntaxError({
              message: res.error.message,
              line: res.error.line,
              linePos: res.error.linePos,
              token: res.error.token || ''
            }));
            // デコレーション追加
            EditorControl.setErrorDecoration(res.error)
          }

        } else if (res.response) {
          // コンパイル成功
          store.dispatch(removeSyntaxError());
          EditorControl.clearErrorDecoration();

          // ComposeX
          if (res.response.flash.other.filter(f => f.name === '@compose').length) {
            store.dispatch(updateSystemState({ key: 'existAnnotationCompose', value: true }))
          }

          if (!res.error) refreshLocationCB(res.response);
        } else {
          throw 'system error by editedCB'
        }
      });
    }, 150);
  };

  return { editedCB };
}
