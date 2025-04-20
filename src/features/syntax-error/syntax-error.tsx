import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './syntax-error.module.css';
import { EditorControl } from '../../editor/editor-control';

export const SyntaxError: React.FC = React.memo(() => {
  const syntaxError = useSelector((state: RootState) => state.syntaxError);

  if (!syntaxError.info) {
    return null;
  }

  return (
    <>
      <div className={styles.errorText}>
          <div style={{ cursor: 'pointer' }} onClick={
            () => {
              if (syntaxError.info?.line) {
                EditorControl.jumpToLine(syntaxError.info.line)
              }
            }
          }>
          [{syntaxError.info.line}:{syntaxError.info.linePos}] {syntaxError.info?.message}
          </div>
      </div>
    </>
  )
})
