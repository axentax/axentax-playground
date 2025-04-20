import { EditorX, MonacoX } from "./editor";
import type * as IMonaco from 'monaco-editor'
import { editorCompletionTabs } from "./editor-completion-tabs";
import store from "../store/store";
import { editorCompletionChord } from "./editor-completion-chord";
import { editorCompletionAnnotations } from "./editor-completion-annotation";
import { editorCompletionDegree } from "./editor-completion-degree";
import { editorCompletionStyles } from "./editor-completion-styles";
import { editorCompletionSettings } from "./editor-competion-settings";

export class EditorCompletion {
  static init(editor: EditorX, monaco: MonacoX, editorId: string) {

    // chords
    monaco.languages.registerCompletionItemProvider(editorId, {
      provideCompletionItems: (model, position) => {

        const word = model.getWordUntilPosition(position);

        // スケールがない場合、region内にフォーカスされていない
        if (!store.getState().currentScale.isValid) {
          // todo: 設定の補完
          return { suggestions: editorCompletionSettings(monaco, model, position) }
        };

        if (/^[CDEFGABcdefgab]/.test(word.word)) {
          return { suggestions: editorCompletionChord(monaco, model, position) }; // { suggestions }  
        }

        // chord
        return { suggestions: [] };
      }
    });

    // function
    monaco.languages.registerCompletionItemProvider(editorId, {

      // トリガー文字指定
      triggerCharacters: ['@', ':', '|', '0', '%'],
      // triggerCharacters: [''],

      // プロバイダ設定
      provideCompletionItems: function (model, position) {

        // カーソルを一つ戻すCB
        const prevCursorCBId = editor.addCommand(-1, () => {
          editor.setPosition({
            lineNumber: position.lineNumber,
            column: position.column - 1
          });
        }) as string;

        // 行シンタックス
        const lineText = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        });

        // 入れ込み位置
        const range = {
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: position.lineNumber,
          endColumn: position.column
        }

        let suggestions: IMonaco.languages.CompletionItem[] = [];

        if (lineText.endsWith(':')) {
          console.log('is style')
          suggestions = editorCompletionStyles(monaco, model, position);
        }

        // スケールがない場合、region内にフォーカスされていない
        if (!store.getState().currentScale.isValid) {
          return { suggestions }
        };

        if (lineText.endsWith('%')) {
          suggestions = editorCompletionDegree(monaco, model, position);
        }
        else if (lineText.endsWith('@')) {
          suggestions = editorCompletionAnnotations(monaco, model, position);
        }
        else if (lineText.endsWith('|')) {
          suggestions = editorCompletionTabs(
            // editor,
            monaco,
            position,
            lineText,
            range,
            prevCursorCBId
          );
        }

        return { suggestions };
      }
    });

  }



}
