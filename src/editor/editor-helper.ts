import store from "../store/store";
import { XViewUtils } from "../utils/utils";
import { EditorX, MonacoX } from "./editor";
import { IKeyboardEvent } from 'monaco-editor';
import { editor as monacoEditor } from 'monaco-editor';

/**
 * editor helper: text replace
 * @param editor 
 * @param monaco 
 * @param event 
 * @returns 
 */
export function editorCompletionReplace(editor: EditorX, monaco: MonacoX, event: monacoEditor.IModelContentChangedEvent) {
  const model = editor.getModel();
  if (!model) return;

  const selection = editor.getSelection();
  if (!selection) return;

  const lineContent = model.getLineContent(selection.startLineNumber);

  const changes = event.changes;
  changes.forEach(change => {
    const { text, range } = change

    // { => {}
    if (text === '{') {
      editor.executeEdits('', [{
        range: new monaco.Range(range.startLineNumber, range.startColumn + 1, range.startLineNumber, range.startColumn + 1),
        text: '}',
        forceMoveMarkers: true,
      }]);
      editor.setPosition({ lineNumber: selection.startLineNumber, column: selection.startColumn });
    }
    // ( => ()
    else if (text === '(') {
      editor.executeEdits('', [{
        range: new monaco.Range(range.startLineNumber, range.startColumn + 1, range.startLineNumber, range.startColumn + 1),
        text: ')',
        forceMoveMarkers: true,
      }]);
      editor.setPosition({ lineNumber: selection.startLineNumber, column: selection.startColumn });
    }

    // @@ => @@ {}
    else if (text === '@' && !lineContent.match('{')) {
      const before2string = 
        lineContent[selection.startColumn - 3]
        + lineContent[selection.startColumn - 2];

      // スケールがある場合、region内にフォーカスされている
      if (before2string === '@@' && !store.getState().currentScale.isValid) {
        editor.executeEdits('', [{
          range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
          text: ' {}',
          forceMoveMarkers: true,
        }]);
        editor.setPosition({ lineNumber: selection.startLineNumber, column: selection.startColumn + 2 });
      }
    }
  });
}

/**
 * editor helper: key down return etc..
 * @param editor 
 * @param monaco 
 * @param e 
 * @param indentOrder 
 * @returns 
 */
export function editorCompletionOnkeyDown(editor: EditorX, monaco: MonacoX, e: IKeyboardEvent, indentOrder: number) {
  
  if (e.keyCode === monaco.KeyCode.Enter) {
      
    const model = editor.getModel();

    if (model) {
      const position = editor.getPosition();
      if (!position) return;

      const lineContent = model.getLineContent(position.lineNumber);

      // カーソル位置の前後の文字をチェック
      const beforeChar = lineContent[position.column - 2]; // カーソル位置の1文字前
      const afterChar = lineContent[position.column - 1];  // カーソル位置の文字

      // lineContent ベースインデント
      const spaceOrder = XViewUtils.countLeadingSpaces(lineContent);

      // カーソルが {} の中にある場合
      if (beforeChar === '{' && afterChar === '}') {
        e.preventDefault(); // 既定の Enter の動作を防止

        const selection = editor.getSelection();
        if (selection) {
          editor.executeEdits('', [{
            range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
            text: '\n' + ' '.repeat(spaceOrder + indentOrder) + '\n' + ' '.repeat(spaceOrder),
            forceMoveMarkers: true,
          }]);
          editor.setPosition({ lineNumber: selection.startLineNumber + 1, column: selection.startColumn + spaceOrder + indentOrder });
        }
      }
    }
  }
}
