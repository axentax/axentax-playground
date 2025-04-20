import React, { useEffect } from 'react'
import { CurrentTabObjDual } from './use-tab-obj-finder'
import { isEqual } from 'lodash';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { FingerBoardControl, useFingerBoardController } from '../../components/base-finger-board/use-finger-board-controller';
import { BaseFingerBoard, ShowBoardKey } from '../../components/base-finger-board/base-finger-board';
import { IKey } from 'axentax-compiler';

interface Props {
  dualId: number,
  CurrentTabObjDual: () => CurrentTabObjDual
}
export const TimelineBoard: React.FC<Props> = (props: Props) => {

  // const symObj = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId], isEqual);
  const tab = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.tab, isEqual);
  const trueTab = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.trueTab, isEqual);
  const activeTab = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.activeTab, isEqual);
  const tuning = useSelector((state: RootState) => state.curPlaySym.symArrObj[props.dualId]?.region.tuning, isEqual);

  const {
    svgRefLeft,
    svgRefRight,
    fretBoardRef,
    setFingers,
    // fretKeyScaleChange,
    scrollIdPrefix,
  } = useFingerBoardController();


  useEffect(() => {

      const fbcList: FingerBoardControl[] = [];
      if (!tab || !tab.length) {
        // not note
        setFingers([0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { return { stringIndex: i } }));
      } else {
        // exist note
        tab.forEach((fret, i) => {
          const fbc: FingerBoardControl = {
            stringIndex: i,
            fret
          }
          if (activeTab && fret === undefined && activeTab[i] !== undefined) {
            fbc.echo = activeTab[i];
          }
          if (trueTab && trueTab[i] !== undefined && trueTab[i] !== fret) {
            // stepの場合コード音全部設定されてしまっているが、都合良い仕様とする。
            fbc.shadow = trueTab[i];
          }
          fbcList.push(fbc)
        })
      }
      setFingers(fbcList);

  }, [tab, trueTab, activeTab])

  // 弦key表示
  useEffect(() => {
    (['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'] as IKey[]).forEach((key) => {
      const elmsLeft = svgRefLeft.current?.querySelectorAll('.' + key);
      elmsLeft?.forEach(elm => (elm as HTMLElement).style.opacity = '1');
    })
  }, [])
  

  return (<>
    {/* <div className={`areaBorderBottom`}>
      FbTest { Math.random() } { JSON.stringify({}) }
      <button onClick={handleClick}>change</button>
    </div> */}
    <BaseFingerBoard {...{
      svgRefLeft,
      svgRefRight,
      fretBoardRef,
      tuning,
      showBoardKey: ShowBoardKey.None,
      scrollIdPrefix,
      // handleOnClickFretKeys: () => {},
      // handleOnClickStrings:  () => {}
    }} />
  </>)

}
