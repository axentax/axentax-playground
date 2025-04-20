import type * as IMonaco from 'monaco-editor'
import { MonacoX } from './editor';

export function editorCompletionAnnotations(
  monaco: MonacoX,
  model: IMonaco.editor.ITextModel,
  position: IMonaco.Position,
): IMonaco.languages.CompletionItem[] {

  // 位置情報
  const word = model.getWordUntilPosition(position);
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  };

  // 行シンタックス
  const lineText = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column
  });
  const getBeforeText = (pos: number, text: string) => {
    return text.substring(pos - 3, pos -2);
  }
  const beforeChar = getBeforeText(position.column, lineText);

  if (
    beforeChar === ' '
    || beforeChar === '{' 
    || lineText === word.word
  ) {

    const annotations: IMonaco.languages.CompletionItem[] = [
      {
        label: '@offset',
        kind: monaco.languages.CompletionItemKind.Color,
        insertText: `offset`,
        range,
        documentation: `offset`
      },
      {
        label: '@compose()',
        kind: monaco.languages.CompletionItemKind.Event,
        insertText: `compose($1)`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        documentation: `compose`
      },
      {
        label: '@/compose()',
        kind: monaco.languages.CompletionItemKind.Event,
        insertText: `/compose($1)`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        documentation: `compose end`
      },
      {
        label: '@click',
        kind: monaco.languages.CompletionItemKind.Color,
        insertText: `click`,
        range,
        documentation: `click`
      },
      {
        label: '@click()',
        kind: monaco.languages.CompletionItemKind.Color,
        insertText: `click($1)`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
        documentation: `click`
      },
      {
        label: '@/click',
        kind: monaco.languages.CompletionItemKind.Color,
        insertText: `/click`,
        range,
        documentation: `click stop`
      }
    ];

    return annotations;
  }

  return [];
}
