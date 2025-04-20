import React from "react"
import { CurrentTabObjDual } from "./use-tab-obj-finder";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import { isEqual } from 'lodash';
import classnames from 'classnames';

import styles from './timeline-current-sym.module.scss';
import { TimelineCurrentBend } from "./timeline-current-bend";

// import { EditorInstanceStore } from "../../editor/editor-instance-store";
// import { FingerBoardControl, useSingletonFingerBoardController } from "../../components/base-finger-board/use-finger-board-controller";

interface Props {
  dualId: number,
  CurrentTabObjDual: () => CurrentTabObjDual
}
export const TimelineCurrentSym: React.FC<Props> = React.memo((props: Props) => {

  const symObj = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId], isEqual);
  // const noteStyle = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.style, isEqual);

  const noteStyle = symObj?.style;

  let stepView: string | null = null;
  if (symObj?.stepInfo) {
    const symStrList = symObj.stepInfo.info.parsedStepList[symObj.stepInfo.orderIndex].stepSym;
    stepView = symStrList.join(',')
  }

  return (
    <>
      <div className={styles.contents} >
        <div className={styles.left}>
          <div className={styles.row}>
            <div className={styles.displayNoteWrapper}>
              <div className={styles.topKeyBox}>Note</div>
              <div className={styles.topValueBox}>{
                isEqual(symObj?.trueTab, symObj?.tab)
                  ? (symObj?.note || '-')
                  : [...(symObj?.tab || [])].reverse().join('|')
              }</div>
            </div>

          </div>
          <div className={styles.row}>
            <div className={styles.displayStepWrapper}>
              <div className={styles.topKeyBox}>Step</div>
              <div className={styles.topValueBox}>{stepView ? stepView.slice(-26) : '-'}</div>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.displayMapWrapper}>
              <div className={styles.topKeyBox}>Map</div>
              <div className={styles.topValueBox}>{symObj?.shifted.length ? symObj?.shifted.join('+') : '-'}</div>
            </div>

            <div className={styles.displayIconWrapper}>
              <div className={classnames(styles.iconBox, {
                [styles.iconColorActive]: noteStyle?.slide && !noteStyle?.legato,
                [styles.iconColorDeactive]: !noteStyle?.slide || noteStyle?.legato,
              })}>Slide</div>
            </div>
            <div className={styles.displayIconWrapper}>
              <div className={classnames(styles.iconBox, {
                [styles.iconColorActive]: noteStyle?.approach,
                [styles.iconColorDeactive]: !noteStyle?.approach,
              })}>In</div>
            </div>
            <div className={styles.displayIconWrapper}>
              <div className={classnames(styles.iconBox, {
                [styles.iconColorActive]: noteStyle?.legato,
                [styles.iconColorDeactive]: !noteStyle?.legato,
              })}>Leg</div>
            </div>

          </div>
        </div>

        <div className={styles.right}>
          <TimelineCurrentBend {...{ dualId: props.dualId, CurrentTabObjDual: props.CurrentTabObjDual }}/>
        </div>
      </div>
    </>
  )
});
