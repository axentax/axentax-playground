import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import classnames from 'classnames';
import styles from './timeline-header.module.scss';
import { PlayStatusEN } from '../../store/slice-play-status';

export const TimelineHeader = React.memo(() => {

  const region = useSelector((state: RootState) => state.playRegion.region);
  const playStatus = useSelector((state: RootState) => state.playStatus.status);

  return (
    <div className={styles.contents}>
      <div className={classnames(styles.title, {
        [styles.playActive]: playStatus === PlayStatusEN.PLAY,
        [styles.playCompile]: playStatus === PlayStatusEN.COMPILE,
        [styles.playInactive]: playStatus === PlayStatusEN.STOP
      })}>
        PLAY MONITOR
      </div>
      <div className={styles.info}>
        {playStatus === PlayStatusEN.PLAY && region
          ? (<>
            <div className={styles.region}>
              REGION: {region.id},
            </div>
            <div className={styles.tick}>
              TICK: {region.startLayerTick},
            </div>
            {/* , dualId:{ region.dualId }  */}
          </>)
          : null
        }
      </div>
    </div>
  )
})
