import { ThemeName } from "./themes-names";
import './styles.theme.scss';
import { editorThemeSetter } from "./themes-editor";
import { LSItemName, LSRepo } from "../repository/local-storage-repo";

export class Themes {

  private static DefaultTheme = ThemeName.Dark;

  public static apply(themeName: ThemeName | null = null) {
    const theme = (
      themeName || LSRepo.getItem(LSItemName.Theme) || this.DefaultTheme
    ) as ThemeName;
    document.body.className = theme;
    editorThemeSetter(theme);
    // localStorage.setItem(this.ThemeName, theme);
    LSRepo.setItem(LSItemName.Theme, theme);
  }

}
