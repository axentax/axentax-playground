import type * as IMonaco from 'monaco-editor'
import { MonacoX } from './editor';

const insertBraceList = [
  {
    insert: 'bpm(100..200)',
    doc: ``
  },
  {
    insert: 'bpm(..200)',
    doc: ``
  },
  {
    insert: 'scale(C major)',
    doc: ``
  },
  {
    insert: 'scale(C diminish)',
    doc: ``
  },
  {
    insert: 'scale(C halfDiminish)',
    doc: ``
  },
  {
    insert: 'scale(C pentatonic)',
    doc: ``
  },
  {
    insert: 'scale(C melodicMinor)',
    doc: ``
  },
  {
    insert: 'scale(C harmonicMinor)',
    doc: ``
  },
  {
    insert: 'scale(C 100100100100)',
    doc: ``
  },
  
];

const insertSingleList = [
  {
    insert: 'bd(vib$1)',
    doc: ``
  },
  {
    insert: 'bd(0..2/8 1, 2.. -2)',
    doc: ``
  },
  {
    insert: 'delay($1)',
    doc: ``
  },
  {
    insert: 'staccato($1)',
    doc: ``
  },
  {
    insert: 'degree(E melodic minor)',
    doc: ``
  },
  {
    insert: 'degree(E harmonic minor 7th mode 3th)',
    doc: ``
  },
  {
    insert: 'leg',
    doc: ``
  },
  {
    insert: 'step(f$1)',
    doc: `is docs`
  },
  {
    insert: 'step(f..62345)',
    doc: `is docs`
  },
  {
    insert: 'step((25.)5m5m5m5m5m5m)',
    doc: `is docs`
  },
  {
    insert: 'step(162534f.)',
    doc: `is docs`
  },
  {
    insert: 'step((16)5^2^f~~~)',
    doc: `is docs`
  },
  {
    insert: 'step(DuduD.du)',
    doc: `is docs`
  },
  {
    insert: 'step(DDD^u^d^u^)',
    doc: `is docs`
  },
  {
    insert: 'step(DDD=u=d=U=d=u=)',
    doc: `is docs`
  },
  {
    insert: 'map(*4)',
    doc: ``
  },
  {
    insert: 'map(0, 2, 4, 6)',
    doc: ``
  },
  {
    insert: 'map(0..3)',
    doc: ``
  },
  {
    insert: 'map(0 step 2 * 4)',
    doc: ``
  },
  {
    insert: 'map(0 step 2 * 4 ss)',
    doc: `mapping with stay string`
  },
  {
    insert: 'map(0 step 2 * 4 sos)',
    doc: `mapping with stay open string`
  },
  {
    insert: 'to',
    doc: ``
  },
  {
    insert: 'to($12/8)',
    doc: ``
  },
  {
    insert: 'to&',
    doc: ``
  },
  {
    insert: '1/4',
    doc: ``
  },
  {
    insert: '4/4',
    doc: ``
  },
  {
    insert: '1/3',
    doc: ``
  },
  {
    insert: '1/6',
    doc: ``
  },
  {
    insert: '1/8',
    doc: ``
  },
  {
    insert: '1/12',
    doc: ``
  },
  {
    insert: '1/16',
    doc: ``
  },
  {
    insert: 'v65',
    doc: ``
  },
  {
    insert: 'v($1|||||)',
    doc: ``
  },
  {
    insert: 'v($165|65|65|65|65|65)',
    doc: ``
  },
  {
    insert: 'v($155|60|65|75|65|55)',
    doc: ``
  },
  {
    insert: 'stroke(off)',
    doc: ''
  }
];

export function editorCompletionStyles(
  monaco: MonacoX,
  model: IMonaco.editor.ITextModel,
  position: IMonaco.Position,
): IMonaco.languages.CompletionItem[] {

  // 位置情報
  // const word = model.getWordUntilPosition(position);
  // const range = {
  //   startLineNumber: position.lineNumber,
  //   endLineNumber: position.lineNumber,
  //   startColumn: word.startColumn,
  //   endColumn: word.endColumn
  // };

  // 入れ込み位置
  const range = {
    startLineNumber: position.lineNumber,
    startColumn: position.column,
    endLineNumber: position.lineNumber,
    endColumn: position.column
  }

  // 行シンタックス
  const lineText = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column
  });
  const getBeforeText = (pos: number, text: string) => {
    return text.substring(pos - 3, pos - 2);
  }
  const beforeChar = getBeforeText(position.column, lineText);
  const word = model.getWordUntilPosition(position);

  // 候補追加
  const applyStyleList = [
    ...insertSingleList,
    ...(beforeChar === '}' || beforeChar === ' ' || lineText === word.word ? insertBraceList : [])
  ]

  // 候補適用
  const styles = applyStyleList.map(m => {
    const obj: IMonaco.languages.CompletionItem = {
      label: ':' + m.insert.replace(/\$1/, ''),
      kind: monaco.languages.CompletionItemKind.Color,
      insertText: m.insert,
      range,
      documentation: m.doc
    }
    if (/\$1/.test(m.insert)) {
      obj.insertTextRules = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
    }
    return obj;
  });

  return styles;
}
