import { useState } from 'react'

import classnames from 'classnames';
import { MdOutlineTextDecrease } from "react-icons/md";
import styles from './control-bottom.module.scss';
import { EditorControl } from '../../editor/editor-control';


export const FontSizeDecrement = (props: { size: string }) => {

  const [state, setState] = useState<boolean>(false)

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: state,
      [styles.iconInactive]: !state
    })} onClick={() => {
      const size = EditorControl.getEditorFontsize();
      if (!state && size > 8) {
        setState(true);
        EditorControl.setEditorFontsize(size - 1);
        setTimeout(() => setState(false), 150);
      }
    }}>
      <MdOutlineTextDecrease size={props.size} />
    </div>
  )

};
