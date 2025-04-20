import classnames from 'classnames';
import { FaEraser } from "react-icons/fa";
import { useCallback, useState } from 'react';
import { EditorInstanceStore } from '../../editor/editor-instance-store';
import styles from './control-bottom.module.scss';
import { EditorControl } from '../../editor/editor-control';


export const EraseOtherSet = (props: { size: string }) => {

  const [state, setState] = useState<boolean>(false)

  const clearEditor = useCallback(() => {
    const editor = EditorInstanceStore.getEditor().editor;
    const model = EditorInstanceStore.getEditor().editor.getModel();
    if (model) {
      const syntax = editor.getValue().split('\n')
        .map(row => {
          return /^\s*(\/\/)?\s*set\./.test(row)
            ? row.replace(/^\s+|\*\/.*?$/g, '')
            : undefined
        })
        .filter(f => f !== undefined)
        .join('\n');
      const customizeSyntax = syntax + (syntax.length ? '\n\n' : '') + '@@ {\n  \n}\n'

      const range = model.getFullModelRange(); // モデルの全範囲を取得
      editor.executeEdits('', [{
        range: range,
        text: customizeSyntax,
        forceMoveMarkers: true
      }]);

      EditorControl.jumpToLine(customizeSyntax.split('\n').length - 2);
      editor.focus();
      editor.setPosition({ lineNumber: customizeSyntax.split('\n').length - 2, column: 3 });
    }
  }, []);

  return (
    <div className={classnames(styles.iconBase, {
      [styles.iconActive]: state,
      [styles.iconInactive]: !state
    })} onClick={() => {
      if (!state) {
        clearEditor();
        setState(true);
        setTimeout(() => setState(false), 200);
      }
    }}>
      {state
        ? (<FaEraser size={props.size} />)
        : (<FaEraser size={props.size} />)
      }
    </div>
  )
}
