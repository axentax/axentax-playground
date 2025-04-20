import { VscScreenFull } from "react-icons/vsc";
import classnames from 'classnames';
import styles from './control-bottom.module.scss';
import { changeFullScreen } from "../../store/status-of-settings/slice-window-control";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const FullScreen = (props: { size: string }) => {
  const dispatch = useDispatch();
  const fullScreenState = useSelector((state: RootState) => state.windowControl.fullScreen);

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: fullScreenState === 1,
      [styles.iconInactive]: fullScreenState === 0
    })} onClick={() => {
      dispatch(changeFullScreen(fullScreenState ? 0 : 1))  
    }}>
      <VscScreenFull size={ props.size } />
    </div>
  )

}