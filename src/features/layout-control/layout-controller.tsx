import React from 'react'
import { ControlButton } from './control-button'
import { SeekTimer } from './seek-timer';

import styles from './layout-controller.module.scss';
export const Controller = React.memo(() => {

  return (
    <div className={`${styles.controller} unSelectable`}>
      <div className={ styles.leftOn }> {/* styles.left */}
        <ControlButton />
      </div>
      <div className={ styles.right }>
        <SeekTimer />
      </div>
    </div>
  )
});
