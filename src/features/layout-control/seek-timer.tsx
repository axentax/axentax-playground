import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { XViewUtils } from '../../utils/utils';
import { BPMPos } from 'axentax-compiler';

import { XSynth } from '../../synth/x-synth';
import { ConductStore } from '../../conduct/conduct-store';
import { PlayStatusEN } from '../../store/slice-play-status';

import styles from './seek-timer.module.scss';

const splitOrder = 9999;

export const SeekTimer: React.FC = React.memo(() => {

  const playStatus = useSelector((state: RootState) => state.playStatus.status);
  const syntaxError = useSelector((state: RootState) => state.syntaxError.info);
  const versionMatched = useSelector((state: RootState) => state.syntaxMatchVersion.matched)

  const seekBarDisabled = (syntaxError && playStatus !== PlayStatusEN.PLAY)
    || (!versionMatched && playStatus !== PlayStatusEN.PLAY)
    ? true
    : false;

  const { seekTick } = useSelector((state: RootState) => state.playTick);
  const bpm = useSelector((state: RootState) => state.playBPM.bpm) || 120;

  const [flash, setFlash] = useState(false);
  useEffect(() => {
    // textの変更に応じてフラッシュエフェクトをトリガーする
    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 300); // エフェクト時間に応じて調整
    return () => clearTimeout(timer);
  }, [bpm]);


  const [width, setWidth] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // ResizeObserverの作成
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          // 動的な幅をセット
          setWidth(entry.contentRect.width);
        }
      }
    });

    // 要素を監視
    resizeObserver.observe(element);

    // クリーンアップ
    return () => {
      resizeObserver.disconnect();
    };
  }, []);


  // ---
  // --- create 
  // ---

  let timeMS = 0;
  let totalTime = 0;
  let totalTick = 0;

  const bpmList = ConductStore.getPlayObj()?.bpmPosList;
  if (bpmList) {
    const bpmListIndex = findClosestTickIndex(bpmList, seekTick);
    const ticksSinceLast = seekTick - bpmList[bpmListIndex].tick;
    const msPerTick = 60000 / (bpm * 480);

    timeMS = ticksSinceLast * msPerTick + bpmList[bpmListIndex].timeMS;
    totalTime = bpmList[bpmList.length - 1].timeMS;
    totalTick = bpmList[bpmList.length - 1].tick;
  }

  const times = XViewUtils.samplesToTimeWithArray(timeMS);
  const totalTimes = XViewUtils.samplesToTimeWithArray(totalTime); // totalTick

  // ---
  // --- bar: timeを適用したいが、操作時のtick探索オーバーヘッドに懸念があるので一旦このまま
  // ---

  const [barValue, setBarValue] = useState(0);

  useEffect(() => {
    const now = Math.round(seekTick / totalTick * splitOrder);
    if (!isNaN(now)) setBarValue(now)
  }, [seekTick, totalTick])

  /** --- */
  const handleRangeMove = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    const tick = totalTick / splitOrder * value;
    setBarValue(value);
    XSynth.getInstance().setSeek(tick);
  };

  return (
    <div ref={ref}>
      
      {width < 540
        ? <>
          <div className={styles.timeDisplay}>

            { width < 320 ? <>
              <span className={styles.DigitalMini}>{times.min}:{times.sec}</span>
            </> : <>
            <span className={styles.DigitalTime}>{times.min}:{times.sec}</span>
            / <span className={styles.DigitalMini}>{totalTimes.min}:{totalTimes.sec}</span>
            </> }
          
          </div>
        </>
        : <>
          <div className={styles.timeDisplay}>
            BPM:<span className={`text ${flash ? styles.flash : ''}` + ' ' + styles.DigitalBPM}>
              {bpm ? bpm : '-'}
            </span>, &nbsp;
            Time: <span className={styles.DigitalTime}>{times.min}:{times.sec}</span>
            .<span className={styles.DigitalMini}>{times.msec}</span>
            / <span className={styles.DigitalMini}>{totalTimes.min}:{totalTimes.sec}</span>
            {/* .<span className={ styles.DigitalMini }>{ totalTimes.msec }</span> */}
          </div>
        </>
      }
      <div className={styles.seekBarWrapper}>
        <input
          disabled={seekBarDisabled}
          type="range"
          min="0"
          max={splitOrder}
          value={barValue === Infinity ? 0 : barValue}
          onChange={handleRangeMove}
          style={{ width: '100%', opacity: seekBarDisabled ? '0.1' : '1' }}
        />
      </div>
    </div>
  )
});

/**
 * 
 * @param bpmList 
 * @param targetTick 
 * @returns 
 */
function findClosestTickIndex(bpmList: BPMPos[], targetTick: number): number {
  let low = 0;
  let high = bpmList.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (bpmList[mid].tick === targetTick) {
      return mid;
    } else if (bpmList[mid].tick < targetTick) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // low が配列の長さを超えるか、highが0未満になるまでループ
  // これは targetTick が配列のすべての要素よりも大きいか小さい場合に発生
  // targetTick より小さい最大のtickを持つ要素を返す
  return high;
}
