import React, { useEffect } from 'react'
import { CurrentTabObjDual } from './use-tab-obj-finder'
import { BaseFingerBoardMini } from '../../components/base-finger-board-mini/base-mini-board'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { FingerBoardMiniControl, useFingerBoardMiniController } from '../../components/base-finger-board-mini/use-finger-board-mini-controller'
import { isEqual } from 'lodash'

interface Props {
  dualId: number,
  CurrentTabObjDual: () => CurrentTabObjDual
}
export const TimelineBoardMini: React.FC<Props> = (props: Props) => {

  const tab = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.tab, isEqual);
  const trueTab = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.trueTab, isEqual);
  const activeTab = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.activeTab, isEqual);
  const tuning = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.region.tuning, isEqual);

  const {
    svgRefRight,
    setFingers,
    scrollIdPrefix,
    setFretLocation
  } = useFingerBoardMiniController();


  useEffect(() => {

    const fbcList: FingerBoardMiniControl[] = [];
    if (!tab || !tab.length) {
      // not note
      setFingers([0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { return { stringIndex: i } }));
    } else {
      // exist note
      tab.forEach((fret, i) => {
        const fbc: FingerBoardMiniControl = {
          stringIndex: i,
          fret
        }
        if (activeTab && fret === undefined && activeTab[i] !== undefined) {
          fbc.echo = activeTab[i];
        }
        if (trueTab && trueTab[i] !== undefined && trueTab[i] !== fret) {
          fbc.shadow = trueTab[i];
        }
        fbcList.push(fbc)
      })
    }
    setFingers(fbcList);

  }, [tab, trueTab, activeTab])

  return (
    <div>
      <BaseFingerBoardMini {...{
        svgRefRight,
        tuning,
        showBoardKey: false,
        scrollIdPrefix,
        setFretLocation
      }} />
    </div>
  )
}
