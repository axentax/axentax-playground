import { useState } from 'react'

import classnames from 'classnames';

import { MdOutlineTextIncrease } from "react-icons/md";

import styles from './control-bottom.module.scss';

import { EditorControl } from '../../editor/editor-control';


export const FontSizeIncrement = (props: { size: string }) => {
  
  const [state, setState] = useState<boolean>(false)

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: state,
      [styles.iconInactive]: !state
    })} onClick={() => {
      const size = EditorControl.getEditorFontsize();
      if (!state && size < 24) {
        setState(true);
        setTimeout(() => setState(false), 150);
        EditorControl.setEditorFontsize(size + 1);
      }
    }}>
      <MdOutlineTextIncrease size={ props.size } />
    </div>
  )

};
