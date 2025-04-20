import type * as IMonaco from 'monaco-editor'
import { MonacoX } from './editor';

const keys = [
  '1', '2', '3', '4', '5', '6', '7'
].reverse();

const suffixes = [
  '',
  // '6',
  // 'm6',
  // '7',
  // 'm7',
  // '9',
  // 'm9',
  // '11',
  // 'm11',
  // '13',
  // 'm13',
  // 'maj7',
  // 'mmaj7',
  // 'maj7b5',
  // 'maj7#5',
  // 'dim',
  // 'dim7',
  // 'aug',
  // 'aug7',
  // 'add9',
  // 'add11',
  // 'add13',
  // 'sus2',
  // 'sus4'
];

const patterns = (() => {
  return keys.flatMap(key => {
    return suffixes.map(suf => {
      return key + suf
    })
  })
})();

export function editorCompletionDegree(
  monaco: MonacoX,
  model: IMonaco.editor.ITextModel,
  position: IMonaco.Position,
  // range: any,
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
    return patterns.map(m => {
      return {
        label: '%' + m,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: m,
        range: range
      }
    });
  }

  // console.log('before', `"${lineText}" === "${word.word}" / "${beforeChar}"`, );
  return [];
}
