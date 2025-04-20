import { useState } from 'react'
import { ThemeName } from '../../theme/themes-names';
import { Themes } from '../../theme/themes';
import classnames from 'classnames';
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";

import styles from './control-bottom.module.scss';
import { LSItemName, LSRepo } from '../../repository/local-storage-repo';


export const ThemeChanger = (props: { size: string }) => {

  const _theme = (LSRepo.getItem(LSItemName.Theme) || ThemeName.Dark) as ThemeName;
  const [theme, setTheme] = useState<ThemeName>(_theme);

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: theme !== 'dark',
      [styles.iconInactive]: theme === 'dark'
    })} onClick={() => {
      setTheme(theme === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark)
      Themes.apply(theme === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark)
    }}>
      {
        theme === ThemeName.Dark ? <CiDark size={ props.size } /> : <CiLight size={ props.size } /> 
      }
    </div>
  )

};
