// import { FaUndo } from "react-icons/fa";
import { IoArrowUndo } from "react-icons/io5";
import classnames from 'classnames';
import styles from './control-bottom.module.scss';
import { useCallback, useState } from "react";
import { EditorInstanceStore } from "../../editor/editor-instance-store";


export const SyntaxUndo = (props: { size: string }) => {

  const [state, setState] = useState<boolean>(false)

  const undo = useCallback(() => {
    const editor = EditorInstanceStore.getEditor().editor;
    editor.trigger('keyboard', 'undo', null);
  }, [])

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: state,
      [styles.iconInactive]: !state
    })} onClick={() => {
      if (!state) {
        undo();
        setState(true);
        setTimeout(() => setState(false), 200);
      }
    }}>
      <IoArrowUndo size={ props.size } />
    </div>
  )

}