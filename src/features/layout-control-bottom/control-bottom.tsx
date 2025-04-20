import React from 'react';
import { FollowEditorButton } from './follow-editor-button';

import styles from './control-bottom.module.scss';
import { ThemeChanger } from './theme-changer';
import { FullScreen } from './full-screen';
import { PanelRight } from './panel-right';
import { EraseOtherSet } from './erase-other-set';
import { SyntaxUndo } from './syntax-undo';
import { SyntaxRedo } from './syntax-redo';
import { FontSizeIncrement } from './font-size-increment';
import { FontSizeDecrement } from './font-size-decrement';

export const LayoutControlBottom = React.memo(() => {

  return (
    <div className={styles.controlBottom}>
        <FollowEditorButton size='22px' />
        <SyntaxUndo size='22px' />
        <SyntaxRedo size='22px' />
        <EraseOtherSet size='21px'/>
        <FontSizeDecrement size='26px'/>
        <FontSizeIncrement size='24px'/>
        <ThemeChanger size='22px'/>
        <FullScreen size='22px'/>
        <PanelRight size='22px'/>
    </div>
  )
})
