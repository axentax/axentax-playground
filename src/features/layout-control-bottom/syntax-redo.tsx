// import { FaRedo } from "react-icons/fa";
import { IoArrowRedo } from "react-icons/io5";
import classnames from 'classnames';
import styles from './control-bottom.module.scss';
import { useCallback, useState } from "react";
import { EditorInstanceStore } from "../../editor/editor-instance-store";


export const SyntaxRedo = (props: { size: string }) => {

  const [state, setState] = useState<boolean>(false)

  const redo = useCallback(() => {
    const editor = EditorInstanceStore.getEditor().editor;
    editor.trigger('keyboard', 'redo', null);
  }, [])

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: state,
      [styles.iconInactive]: !state
    })} onClick={() => {
      if (!state) {
        redo();
        setState(true);
        setTimeout(() => setState(false), 200);
      }
    }}>
      <IoArrowRedo size={ props.size } />
    </div>
  )

}