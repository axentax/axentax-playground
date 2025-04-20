import type * as IMonaco from 'monaco-editor'
import { MonacoX } from './editor';


export function editorCompletionTabs(
  monaco: MonacoX,
  position: IMonaco.Position,
  lineText: string,
  range: IMonaco.IRange | IMonaco.languages.CompletionItemRanges,
  prevCursorCBId: string
): IMonaco.languages.CompletionItem[] {

  const getStart = (pos: number, frontLength: number, text: string) => {
    return text.substring(pos - frontLength - 2, pos - 2);
  }
  const getBeforeText = (pos: number, text: string) => {
    return text.substring(pos - 3, pos -2);
  }
  const beforeChar = getBeforeText(position.column, lineText);
  const back3 = getStart(position.column, 3, lineText);
  const hasBeforeTargetChar = beforeChar === ' ' || beforeChar === '{' || /^[\d|r]>>$/.test(back3);
  if (!hasBeforeTargetChar) return [];
  
  const tabs: IMonaco.languages.CompletionItem[] = [
    {
      label: '||||| basic tab',
      kind: monaco.languages.CompletionItemKind.Color,
      insertText: `$1||||`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range,
      documentation: `tab`,
      command: {
        id: prevCursorCBId as string,
        title: 'document'
      }
    }
  ];

  return tabs;
}
