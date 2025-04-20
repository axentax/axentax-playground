// import { EditorX } from "../features/strum-editor/strum-editor";

// export type OnDidBlueForKeyDownEditorUnfocused = () => void;

// export const keyDownEditorUnfocused = (
//   editor: EditorX,
//   oneKey: string,
//   callback: (event: KeyboardEvent) => void
// ): OnDidBlueForKeyDownEditorUnfocused => {

//   function handleKeyDown(event: KeyboardEvent) {

//     const key = event.key === 'Spacebar' ? ' ' : event.key;

//     if (oneKey !== key) {
//       return;
//     }

//     event.preventDefault();
//     callback(event);
//   }

//   editor.onDidFocusEditorText(() => {
//     console.log('エディターにフォーカスが当たりました');
//     // ショートカット設定
//     document.removeEventListener('keydown', handleKeyDown);
//   });

//   const onDidBlue: OnDidBlueForKeyDownEditorUnfocused = () => {
//     console.log('エディターからフォーカスが外れました');
//     document.addEventListener('keydown', handleKeyDown);
//   };

//   editor.onDidBlurEditorText(() => {
//     onDidBlue();
//   });

//   // コンポーネント(layout-console)から強制離脱された時に実施する
//   return onDidBlue;
// }

