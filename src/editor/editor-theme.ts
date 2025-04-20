import { ThemeName } from "../theme/themes-names";
import { EditorInstanceStore } from "./editor-instance-store";

export function setEditorTheme(theme: ThemeName) {

  const monaco = EditorInstanceStore.getEditor().monaco;
  if (!monaco) {
    throw 'Editor is not ready';
  }

  const caseColorDark = {
    annotation: 'bc58a8',
    annotationCompose: '59bd42',
    annotationComposeValue: '0d9756',
    style: {
      name: '40a8fa',
      value: 'bd9745',
      valueTag: 'a66a2a',
      valueLight: 'bd9745',
      nameDark: '40a8fa',
    },
    step: {
      valueLight: '98833f',
    },
    setting: {
      name: 'bc58a8',
      value: 'bd9745'
    },
    region: {
      mark: 'ffff00',
      prop: 'a8a825'
    },
    dual: {
      mark: 'd0ba0b',
      prop: '9a893b'
    }
  };


  switch (theme) {
    case (ThemeName.Dark): {
      // editor.
      monaco.editor.defineTheme('customTheme', {
        base: 'vs-dark', // vs-dark テーマをベースにします
        inherit: true,  // vs-dark のスタイルを継承
        colors: {
          'editor.background': '#1e1e1e', // エディタの背景色
          'editor.foreground': '#d4d4d4', // エディタの前景色（文字色）
          'editor.selectionBackground': '#264f78', // 選択範囲の背景色
          'editor.lineHighlightBackground': '#2d2d2d', // カーソル行のハイライト色
          'editorCursor.foreground': '#ffffff', // カーソルの色
          'editor.wordHighlightBackground': '#575757', // アクティブな単語のハイライト色
          'editor.wordHighlightStrongBackground': '#9a5b4f', // アクティブな単語の強調ハイライト色
          'editorBracketMatch.background': '#006400', // ブラケットマッチの背景色
          'editorBracketMatch.border': '#98c379'  // ブラケットマッチのボーダー色
        },
        rules: [
          { token: 'keyword', foreground: '569cd6' },
          { token: 'all-comment', foreground: 'ff0000' },
          { token: 'approach-separate', foreground: '888888' },

          { token: 'region', foreground: caseColorDark.region.mark },
          { token: 'region.prop', foreground: caseColorDark.region.prop },
          { token: 'dual', foreground: caseColorDark.dual.mark },
          { token: 'dual.prop', foreground: caseColorDark.dual.prop },

          { token: 'annotation-click', foreground: caseColorDark.annotation },
          { token: 'annotation-offset', foreground: caseColorDark.annotation },
          { token: 'annotation.compose', foreground: caseColorDark.annotationCompose },
          { token: 'annotation.compose.value', foreground: caseColorDark.annotationComposeValue },

          { token: 'setting-name', foreground: caseColorDark.setting.name },
          { token: 'setting-value', foreground: caseColorDark.setting.value },

          { token: 'style.start', foreground: caseColorDark.style.name },
          { token: 'style.end', foreground: caseColorDark.style.name },
          { token: 'style.value', foreground: caseColorDark.style.valueLight },
          { token: 'style.value.light', foreground: caseColorDark.style.valueLight },

          { token: 'step.start', foreground: caseColorDark.style.name },
          { token: 'step.end', foreground: caseColorDark.style.name },
          { token: 'step.number', foreground: caseColorDark.step.valueLight },
          { token: 'step.value', foreground: caseColorDark.step.valueLight },

          { token: 'bend.start', foreground: caseColorDark.style.name },
          { token: 'bend.end', foreground: caseColorDark.style.name },
          { token: 'bend.sep.number', foreground: caseColorDark.style.value },
          { token: 'bend.number', foreground: caseColorDark.style.valueLight },
          { token: 'bend.tag', foreground: caseColorDark.style.valueTag },
          { token: 'bend.value', foreground: caseColorDark.style.valueLight },

          { token: 'etc-style', foreground: caseColorDark.style.name },
          { token: 'etc-style-dark', foreground: caseColorDark.style.nameDark },

          // { token: 'bracket', foreground: 'ff0000', fontStyle: 'bold' }, // 赤色 + 太字
          // { token: 'pipes', foreground: '00ff00', fontStyle: 'italic' }, // 緑色 + イタリック
        ],
      });
      // カスタムテーマの適用
      monaco.editor.setTheme('customTheme');

      break;
    }
    case (ThemeName.Light): {

      // Lightテーマのカスタム設定
      monaco.editor.defineTheme('customLightTheme', {
        base: 'vs', // vs (light) テーマをベースにします
        inherit: true,  // vs のスタイルを継承
        colors: {
          'editor.background': '#ffffff', // エディタの背景色（白）
          'editor.foreground': '#333333', // エディタの前景色（暗めのグレー）
          'editor.selectionBackground': '#add6ff', // 選択範囲の背景色（薄い青）
          'editor.lineHighlightBackground': '#f7f7f7', // カーソル行のハイライト色（非常に薄いグレー）
          'editorCursor.foreground': '#000000', // カーソルの色（黒）
          'editor.wordHighlightBackground': '#b4d5ff', // アクティブな単語のハイライト色（薄い青）
          'editor.wordHighlightStrongBackground': '#82b0ff', // アクティブな単語の強調ハイライト色（やや濃い青）
          'editorBracketMatch.background': '#f0f0f0', // ブラケットマッチの背景色
          'editorBracketMatch.border': '#c0c0c0'  // ブラケットマッチのボーダー色（灰色）
        },
        rules: [ // region-start:053ef7
          { token: 'keyword', foreground: '569cd6' },
          { token: 'all-comment', foreground: 'ff0000' },
          { token: 'approach-separate', foreground: '888888' },

          { token: 'region', foreground: caseColorDark.region.mark },
          { token: 'region.prop', foreground: caseColorDark.region.prop },
          { token: 'dual', foreground: caseColorDark.dual.mark },
          { token: 'dual.prop', foreground: caseColorDark.dual.prop },

          { token: 'annotation-click', foreground: caseColorDark.annotation },
          { token: 'annotation-offset', foreground: caseColorDark.annotation },
          { token: 'annotation.compose', foreground: caseColorDark.annotationCompose },
          { token: 'annotation.compose.value', foreground: caseColorDark.annotationComposeValue },

          { token: 'setting-name', foreground: caseColorDark.setting.name },
          { token: 'setting-value', foreground: caseColorDark.setting.value },

          { token: 'style.start', foreground: caseColorDark.style.name },
          { token: 'style.end', foreground: caseColorDark.style.name },
          { token: 'style.value', foreground: caseColorDark.style.valueLight },
          { token: 'style.value.light', foreground: caseColorDark.style.valueLight },

          { token: 'step.start', foreground: caseColorDark.style.name },
          { token: 'step.end', foreground: caseColorDark.style.name },
          { token: 'step.number', foreground: caseColorDark.step.valueLight },
          { token: 'step.value', foreground: caseColorDark.step.valueLight },

          { token: 'bend.start', foreground: caseColorDark.style.name },
          { token: 'bend.end', foreground: caseColorDark.style.name },
          { token: 'bend.sep.number', foreground: caseColorDark.style.value },
          { token: 'bend.number', foreground: caseColorDark.style.valueLight },
          { token: 'bend.tag', foreground: caseColorDark.style.valueTag },
          { token: 'bend.value', foreground: caseColorDark.style.valueLight },

          { token: 'etc-style', foreground: caseColorDark.style.name },
          { token: 'etc-style-dark', foreground: caseColorDark.style.nameDark },
        ],
      });
      // エディタにカスタムテーマを適用
      monaco.editor.setTheme('customLightTheme');

      break;
    }
  }
}
