import React from 'react'
import { useTabObjFinder } from './use-tab-obj-finder';
import { TimelineHeader } from './timeline-header';
import { TimelineBoardMini } from './timeline-board-mini';
import { TimelineCurrentSym } from './timeline-current-sym';

import styles from './layout-timeline.module.scss';

export const LayoutTimeline: React.FC = React.memo(() => {

  // 現在再生位置のTabObjDual (CurrentTabObjDualは一旦未使用)
  const { CurrentTabObjDual } = useTabObjFinder();

  return (
    <div className={ styles.contents }>
      {/* <div>TimelineBox: {Math.random()}</div> */}
      <div><TimelineHeader /></div>
      
      <div className={ styles.dualBottom }>
        <TimelineBoardMini {...{ dualId: 0, CurrentTabObjDual }} />
        <TimelineCurrentSym {...{ dualId: 0, CurrentTabObjDual }}/>
      </div>

      <div className={ styles.dualBottom }>
        <TimelineBoardMini {...{ dualId: 1, CurrentTabObjDual }} />
        <TimelineCurrentSym {...{ dualId: 1, CurrentTabObjDual }}/>
      </div>

      <div className={ styles.dualBottom }>
        <TimelineBoardMini {...{ dualId: 2, CurrentTabObjDual }} />
        <TimelineCurrentSym {...{ dualId: 2, CurrentTabObjDual }}/>
      </div>

      {/* <div><TimelineBoard {...{ dualId: 0, CurrentTabObjDual }}/></div> */}
      {/* <div><TimelineBoard {...{ dualId: 1, CurrentTabObjDual }}/></div> */}
      {/* <div><TimelineBoard {...{ dualId: 2, CurrentTabObjDual }}/></div> */}
      
      {/* <div><TimelineCurrentSym {...{ dualId: 1, CurrentTabObjDual }}/></div>
      <div><TimelineCurrentSym {...{ dualId: 2, CurrentTabObjDual }}/></div> */}
    </div>
  )
});
  
