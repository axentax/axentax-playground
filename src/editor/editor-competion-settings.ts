import type * as IMonaco from 'monaco-editor'
import { MonacoX } from './editor';

const insertBasicSettingsList = [
  {
    insert: 'set.style.degree: C major',
    doc: ``
  },
  {
    insert: 'set.style.degree: C harmonic minor 7th mode 3th',
    doc: ``
  },
  {
    insert: 'set.style.scale: C major',
    doc: ``
  },
  {
    insert: 'set.style.scale: C diminish',
    doc: ``
  },
  {
    insert: 'set.style.scale: C halfDiminish',
    doc: ``
  },
  {
    insert: 'set.style.scale: C pentatonic',
    doc: ``
  },
  {
    insert: 'set.style.scale: C melodicMinor',
    doc: ``
  },
  {
    insert: 'set.style.scale: C harmonicMinor',
    doc: ``
  },
  {
    insert: 'set.style.scale: C 101010101010',
    doc: ``
  },
  {
    insert: 'set.style.scale: C 100100100100',
    doc: ``
  },
  {
    insert: 'set.style.tuning: E|A|D|G|B|E',
    doc: `6 strings normal tuning`
  },
  {
    insert: 'set.style.tuning: D|G|C|F|A|D',
    doc: `6 strings low tuning`
  },
  {
    insert: 'set.style.tuning: C#|F#|B|E|A|D|G|B|E',
    doc: `9 string normal tuning`
  },
  {
    insert: 'set.style.tuning: D|G|C|F|A#|D#|G#|C|F',
    doc: `9 strings must low tuning`
  },
  {
    insert: 'set.style.tuning: C#|F#|B|E|A|D|G|B|E',
    doc: `9 strings must hi tuning`
  },
  {
    insert: 'set.style.until: 4/4',
    doc: ``
  },
  {
    insert: 'set.style.bpm: 120',
    doc: ``
  },
  {
    insert: 'set.dual.pan: true',
    doc: ``
  },
  {
    insert: 'set.dual.panning: [0.5, 0, 1]',
    doc: ``
  },
  {
    insert: 'set.click.until: 1/4',
    doc: ``
  },
  {
    insert: 'set.click.inst: 42 // 36 37 42',
    doc: ``
  },
  {
    insert: 'set.click.velocity: 65',
    doc: ``
  },
  {
    insert: 'set.click.accent: 0',
    doc: ``
  },
  {
    insert: 'set.play.velocities: 80|75|70|60|55|62|62|55|45',
    doc: ``
  },
  {
    insert: 'set.play.velocities: $1|||||',
    doc: ``
  },
  {
    insert: 'set.play.strum.defaultStrumWidthMSec: 30',
    doc: ``
  },
  {
    insert: 'set.play.strum.velocity: 70',
    doc: ``
  }
];

/*
set.style.degree: E harmonic 7th minor mode 3th
set.style.scale: E melodicMinor
set.style.tuning: B|C#|D#|E|A|D|G|B|E
set.style.until: 1/4
set.style.bpm: 200
set.dual.pan: true
set.dual.panning: [0.5, 0, 1]
set.click.until: 1/4
set.click.inst: 42 // 36 37 42
set.click.velocity: 65
set.click.accent: 1 // default 0, 0は未指定
set.play.velocities: 80|75|70|60|55|62|62|55|45 // default all 95
// set.play.velocities: $1||||||

set.play.strum.defaultStrumWidthMSec: 30
set.play.strum.velocity: 70

*/


export function editorCompletionSettings(
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
  // const getBeforeText = (pos: number, text: string) => {
  //   return text.substring(pos - 3, pos - 2);
  // }
  // const beforeChar = getBeforeText(position.column, lineText);

  // 候補追加

  // 候補適用
  if (/^\s*s/.test(lineText)) {
    const styles = insertBasicSettingsList.map(m => {
      const obj: IMonaco.languages.CompletionItem = {
        label: m.insert.replace(/\$1/, ''),
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

  return [];
}
