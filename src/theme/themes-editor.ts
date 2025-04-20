import { ThemeName } from "./themes-names";
import { setEditorTheme } from "../editor/editor-theme";

export function editorThemeSetter(theme: ThemeName) {
  setEditorTheme(theme)
}
