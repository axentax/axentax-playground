import { useState } from "react";
import classnames from 'classnames';
import { LuPanelLeftOpen } from "react-icons/lu";
import styles from './control-bottom.module.scss';

export const PanelLeft = (props: { size: string }) => {

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: open !== false,
      [styles.iconInactive]: open === false
    })} onClick={() => {
      setOpen(!open)
    }}>
      <LuPanelLeftOpen size={ props.size } />
    </div>
  )
}
