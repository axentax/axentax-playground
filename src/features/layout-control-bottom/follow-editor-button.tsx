import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { toggleFollowEditorLineWhenPlaying } from '../../store/status-of-settings/slice-status-of-settings';
import { FaFilm } from "react-icons/fa";

import classnames from 'classnames';

import styles from './control-bottom.module.scss';
/*
  on/off 
  dualId選択 or auto
*/

/**
 * followEditorLineWhenPlaying
 *   0: off: 追跡一切しない
 *   1: 緑: 追跡状態
 *   2: 赤: syntax変更により追跡不可
 */

export const FollowEditorButton = (props: { size: string }) => {
  const dispatch = useDispatch();

  const followEditorLineWhenPlaying = useSelector((state: RootState) => state.statusOfSettings.followEditorLineWhenPlaying);

  const versionMatched = useSelector((state: RootState) => state.syntaxMatchVersion.matched);

  const handleClickFollowEditorLineWhenPlaying = () => {
    dispatch(toggleFollowEditorLineWhenPlaying());
  };

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: followEditorLineWhenPlaying && versionMatched,
      [styles.iconActiveColor]: followEditorLineWhenPlaying && versionMatched,
      [styles.iconActiveRed]: followEditorLineWhenPlaying && !versionMatched,
      [styles.iconActiveRedColor]: followEditorLineWhenPlaying && !versionMatched,
      [styles.iconInactive]: !followEditorLineWhenPlaying
    })} onClick={handleClickFollowEditorLineWhenPlaying}>
      <FaFilm size={ props.size } />
    </div>
  )
}
