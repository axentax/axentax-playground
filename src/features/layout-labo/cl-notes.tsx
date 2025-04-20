import React from 'react';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

import styles from './layout-labo.module.scss';
import { isEqual } from 'lodash';

export const CLNotes = React.memo(() => {

  /*
  # tonal sample
  # import { tonal } from 'axentax-compiler';
  # tonal.detect(['C','E','G'])//=>['CM','Em#5/C']
  */

  const noteSym = useSelector((state: RootState) => state.currentNotes.noteSym, isEqual);
  const chord = useSelector((state: RootState) => state.currentNotes.chord, isEqual);
  const tab = useSelector((state: RootState) => state.currentNotes.tab, isEqual);
  const trueTab = useSelector((state: RootState) => state.currentNotes.trueTab, isEqual);
  const activeTab = useSelector((state: RootState) => state.currentNotes.activeBows, isEqual);

  // const style = useSelector((state: RootState) => state.currentNotes.style, isEqual);

  if (!noteSym) return null;

  return (
    noteSym
      ? (
        <>
          <div className={styles.nowrap}>$Notes: {chord} | {noteSym}</div>
          <div>$Tab: {[...tab].reverse().join('|')} | TrueTab: {[...trueTab].reverse().join('|')} | ActiveTab: {[...activeTab].reverse().join('|')} |  {Math.random()}</div>
        </>
      )
      : (
        <>
          <div>#Notes:</div>
          <div>#Tab:</div>
        </>
      )
  );
});
