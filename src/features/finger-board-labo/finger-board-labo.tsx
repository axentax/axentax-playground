import { BaseFingerBoard, ShowBoardKey } from '../../components/base-finger-board/base-finger-board';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { isEqual } from 'lodash';
import { FingerBoardControl, useFingerBoardController } from '../../components/base-finger-board/use-finger-board-controller';


export const FingerBoardLabo = React.memo(() => {

  const tuning = useSelector((state: RootState) => state.clRegion.region?.tuning, isEqual);
  const scale = useSelector((state: RootState) => state.currentScale, isEqual);  
  const tab = useSelector((state: RootState) => state.currentNotes.tab, isEqual);
  const trueTab = useSelector((state: RootState) => state.currentNotes.trueTab, isEqual);
  const activeTab = useSelector((state: RootState) => state.currentNotes.activeBows, isEqual);

  const {
    svgRefLeft,
    svgRefRight,
    fretBoardRef,
    setFingers,
    fretKeyScaleChange,
    scrollIdPrefix
  } = useFingerBoardController();

  useEffect(() => {
    
    // if (scale.bin.includes(1)) {
    const ind = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(scale.key);
    const newBin = scale.bin.slice(-ind).concat(scale.bin.slice(0, -ind));
    fretKeyScaleChange(newBin)
    // todo:スケールがない時、弦キーだけ表示したい
    //      svgRefLeftで操作したが最初に9弦チューニングに移動した時に987弦のキーがopacity0.2のままになってしまった
    //      また、ここでscale.binに1が含まれていない場合は、スケールを非表示にする必要があるため
    //      どのみちここでは処理できない
  }, [scale])

  useEffect(() => {
    const fbcList: FingerBoardControl[] = [];
    if (!tab.length) {
      // not note
      setFingers([0,1,2,3,4,5,6,7,8].map((i) => {return { stringIndex: i }}));
    } else {
      // exist note
      tab.forEach((fret, i) => {
        const fbc: FingerBoardControl = {
          stringIndex: i,
          fret
        }
        if (fret === undefined && activeTab[i] !== undefined) {
          fbc.echo = activeTab[i];
        }
        if (trueTab[i] !== undefined && trueTab[i] !== fret) {
          // stepの場合コード音全部設定されてしまっているが、都合良いのでこのまま仕様とする。
          fbc.shadow = trueTab[i];
        }
        fbcList.push(fbc)
      })
    }
    setFingers(fbcList);
  }, [tab, trueTab, activeTab])

  return (<>
    <BaseFingerBoard {...{
      svgRefLeft,
      svgRefRight,
      fretBoardRef,
      tuning,
      showBoardKey: ShowBoardKey.Full,
      scrollIdPrefix,
      handleOnClickFretKeys: (stringIndex: number, fret: number) => {
        console.log('labo(f)', stringIndex, fret)
      },
      handleOnClickStrings:  (stringIndex: number) => {
        console.log('labo(s)', stringIndex)
      },
    }} />
  </>)
});
