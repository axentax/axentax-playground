import React, { useEffect, useRef } from 'react'
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { editor as monacoEditor } from 'monaco-editor';
import { useDispatch } from 'react-redux';
import { setCursorLocation } from '../store/slice-cursor-location';
import { useRefreshCursorLocation } from '../hooks/use-refresh-location';
import { useEditObserver } from '../hooks/use-edit-observer';
import { editorCompletionOnkeyDown, editorCompletionReplace } from './editor-helper';
import { EditorInstanceStore } from './editor-instance-store';
import { Themes } from '../theme/themes';
import { EditorControl } from './editor-control';
import { editorFormatter } from './editor-formatter';
import store from '../store/store';
import { EditorCompletion } from './editor-completion';
import { EditorSyntaxHighlight } from './editor-highlight';
import { LSItemName, LSRepo } from '../repository/local-storage-repo';
import { global } from '../settings';
import { initialSyntax } from '../sample-syntax';


export type EditorX = monacoEditor.IStandaloneCodeEditor;
export type MonacoX = Monaco;
export type EditorRef = React.MutableRefObject<monacoEditor.IStandaloneCodeEditor | null>;
export type ICursorPositionChangedEvent = monacoEditor.ICursorPositionChangedEvent;

interface Props {
  // syntax: string,
  mountedCB: () => void
  // editedCB: () => void,
  // refreshLocationCB: () => void
}
export const StrumEditor: React.FC<Props> = React.memo((props: Props) => {
  const dispatch = useDispatch();

  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const { refreshLocationCB } = useRefreshCursorLocation(); // location refresher
  const { editedCB } = useEditObserver(refreshLocationCB); // edit handler : editorコンポーネントに渡す

  // destruct
  useEffect(() => {
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        console.log('Editor instance disposed');
      }
    };
  }, []);

  // handle edit
  const handleEditorChange = () => {
    editedCB();
  }

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.languages.registerDocumentFormattingEditProvider(EditorInstanceStore.editorId(), {
      provideDocumentFormattingEdits(
        model,
        // options,
        // token,
      ) {
        const text: string = model.getValue();
        // テキストを解析してフォーマット
        const formattedText: string = editorFormatter(text);
        return [
          {
            range: model.getFullModelRange(),
            text: formattedText,
          },
        ];
      },
    });
  };

  // handle mount
  const handleEditorDidMount: OnMount = (
    editor: monacoEditor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoRef.current = monaco;
    editorRef.current = editor;

    outerHandleEditorDidMount(editor, monaco);

    props.mountedCB();

    handleEditorChange();

    // cursor移動リスナー
    // TODO: 
    // const disposable = useRef<IDisposable | null>(null); で以下の返り値を保持し、コンポーネント終了時
    // if (disposable.current) disposable.current.dispose(); する必要がある
    editor.onDidChangeCursorPosition((event: ICursorPositionChangedEvent) => {
      const { lineNumber, column } = event.position;
      dispatch(setCursorLocation({ line: lineNumber, column }));
      // props.refreshLocationCB();
      refreshLocationCB();
    });

  }

  // initial syntax
  let syntax = LSRepo.getItem(LSItemName.SyntaxWhenClose);
  if (!syntax) syntax = initialSyntax;

  return (

    <Editor
      defaultLanguage={EditorInstanceStore.editorId()}
      height="100%"
      theme="customTheme"
      options={{
        fontSize: global.defaultEditorFontSize,
        automaticLayout: true, // エディタの自動レイアウトを有効にする
        // quickSuggestions: false, // 候補非表示 https://chatgpt.com/share/6725a248-8314-800d-be9a-888286dcf114
        // minimap: {
        //   enabled: false  // ミニマップを非表示に設定
        // },
        // lineNumbers: 'off'  // 行番号を非表示に設定
      }}
      defaultValue={syntax}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      onChange={handleEditorChange}
    />
  )
});

/**
 * HandleEditorDidMount
 * @param editorRef 
 * @param editor 
 * @param monaco 
 */
const outerHandleEditorDidMount = (
  // editorRef: React.MutableRefObject<monacoEditor.IStandaloneCodeEditor | null>,
  editor: monacoEditor.IStandaloneCodeEditor,
  monaco: Monaco
) => {
  // set editor instance
  EditorInstanceStore.setEditorInstance({ editor: editor, monaco: monaco });
  // global theme
  Themes.apply();
  EditorControl.setEditorFontsize(
    parseInt(LSRepo.getItem(LSItemName.FontSize) || global.defaultEditorFontSize.toString())
  )
  // on focus
  editor.focus();
  // インデントサイズ
  editor.updateOptions({
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false
  });
  // jump region
  EditorControl.lineNumberClickHandler();
  // editor id
  monaco.languages.register({ id: EditorInstanceStore.editorId() });
  // editor completion
  EditorCompletion.init(editor, monaco, EditorInstanceStore.editorId());
  // editor syntax highlight
  EditorSyntaxHighlight.init(monaco, EditorInstanceStore.editorId());

  // フォーマッター
  editor.addAction({
    id: 'format-document',
    label: 'Format Document',
    keybindings: [
      // Ctrl/Cmd + Shift + F
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
    ],
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1,
    run(ed: monacoEditor.IStandaloneCodeEditor): Promise<void> {
      return ed.getAction('editor.action.formatDocument')!.run();
    },
  });

  // コメントアウト設定
  monaco.languages.setLanguageConfiguration(EditorInstanceStore.editorId(), {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    }
  });

  // ショートカットキーの設定
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, function () {
    const action = editor.getAction('editor.action.commentLine');
    if (action) action.run();
  });

  // 便利置換
  editor.onDidChangeModelContent((event) => {
    editorCompletionReplace(editor, monaco, event);
  });

  // 便利置換2
  const indentOrder = store.getState().statusOfSettings.indentSpaceLevel;
  editor.onKeyDown((e) => {
    editorCompletionOnkeyDown(editor, monaco, e, indentOrder);
  });

};
