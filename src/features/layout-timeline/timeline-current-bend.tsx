import React from 'react'
import { CurrentTabObjDual } from './use-tab-obj-finder';
import { useSelector } from 'react-redux';
import store, { RootState } from '../../store/store';
import { isEqual } from 'lodash';
import { ConductStore } from '../../conduct/conduct-store';
import { BendGraphMini } from '../../components/bend-graph-mini/bend-graph-mini';

import styles from './timeline-current-bend.module.scss';

interface Props {
  dualId: number,
  CurrentTabObjDual: () => CurrentTabObjDual
}
export const TimelineCurrentBend: React.FC<Props> = React.memo((props: Props) => {

  const styleBend = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.style.bd, isEqual);
  const tick = store.getState().curPlaySym.symArrObj[props.dualId]?.tick;

  const bendData = (() => {
    if (styleBend) {
      const _bendMidiSetter = ConductStore.getPlayObj()?.mixesList[props.dualId].bendBank.bendChannelList;
      if (_bendMidiSetter) {
        const tabObjId = store.getState().curPlaySym.symArrObj[props.dualId]?.id;

        const bend = _bendMidiSetter.filter(f => f.tabObjId === tabObjId).flatMap(m => m.bend);

        return bend;
      }
    }
    return null;
  })();

  return (
    <>
      <div className={styles.contents}>
        <BendGraphMini
          bendFlatData={bendData}
          fullX={160}
          fullY={60}
          startTick={tick?.startTick || 0}
          stopTick={tick?.stopTick || 0}
        />
      </div>
    </>
  )

});
