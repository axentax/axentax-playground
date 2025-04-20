import classnames from 'classnames';
import { LuPanelRightClose } from "react-icons/lu";
import { LuPanelRightOpen } from "react-icons/lu";
import styles from './control-bottom.module.scss';
import { useDispatch, useSelector } from "react-redux";
import { toggleRightColumn } from "../../store/status-of-settings/slice-window-control";
import { RootState } from "../../store/store";

export const PanelRight = (props: { size: string }) => {
  const dispatch = useDispatch();

  const rightColumnState = useSelector((state: RootState) => state.windowControl.rightColumn);

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: rightColumnState,
      [styles.iconInactive]: !rightColumnState
    })} onClick={() => {
      dispatch(toggleRightColumn())
    }}>
      { rightColumnState
          ? (<LuPanelRightClose size={ props.size } />)
          : (<LuPanelRightOpen size={ props.size } />)
      }
    </div>
  )
}
