import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { RiExchange2Line } from "react-icons/ri";

import styles from './layout-labo.module.scss';
import { BendGraphMini } from '../../components/bend-graph-mini/bend-graph-mini';
import { CLCursor } from './cl-cursor';
import { isEqual } from 'lodash';
import { SlideLinerMiniOne } from '../../components/slide-liner-mini/slide-liner-mini-one';
import { SlideViewType } from '../../interfaces/slide-view-data';
import { SlideLinerMiniSome } from '../../components/slide-liner-mini/slide-liner-mini-some';


export const LayoutLabo = () => {

  const notes = useSelector((state: RootState) => state.currentNotes);

  const tick = notes.tick;
  const note = notes.chord;
  const trueTab = notes.trueTab;
  const tab = notes.tab;

  // const blockStyle = useSelector((state: RootState) => state.currentBlockStyle.styles);
  // const syntaxError = useSelector((state: RootState) => state.syntaxError);
  const fullScreenState = useSelector((state: RootState) => state.windowControl.fullScreen);

  const bend = useSelector((state: RootState) => state.currentBendData.bend);
  const slide = useSelector((state: RootState) => state.currentSlideData.slide);

  const isChord = !/\|/.test(note);

  return (
    <div className={classnames(styles.contents, {
      [styles.fullScreenActive]: fullScreenState === 1,
      [styles.fullScreenInactive]: fullScreenState === 0
    })}>
      {/* --- header --- */}
      <div className={styles.headerRowWrapper}>
        <div className={styles.title}>NOTE LABO</div>
        <div className={styles.location}>
          {/* <CLScale />  */}
          LOCATION: <CLCursor />
        </div>
      </div>

      {/* --- chord --- */}

      <div className={styles.displayRowWrapper}>
        {/* <div className={styles.symArea}> */}
        <div className={classnames(styles.chordSymWrapper, {
          [styles.chordSymFont]: isChord,
          [styles.tabSymFont]: !isChord
        })}>
          {/* mapの場合 note はコピーしていない */}
          <div>
            { note
              ? note
              : <div className={styles.normalComment}>focus note on editor</div>
            }
          </div>
          {
            isEqual(tab, trueTab)
              ? null
              : <div className={styles.movedTab}>
                <RiExchange2Line /> {[...tab].reverse().join('|')}
              </div>
          }
        </div>
        <div className={styles.iconSymWrapper}>
          step | map | legato | until | velocity
        </div>

        {/* </div> */}
        <div className={styles.tabScoreWrapper}>
          {/* tab */}
        </div>
      </div>

      <div className={styles.bendRowWrapper}>
        <div className={styles.bendWrapper}>
          {bend
            ? <BendGraphMini
              bendFlatData={bend.flatMap(m => m.bend)}
              fullX={392}
              fullY={50}
              startTick={tick.startTick}
              stopTick={tick.stopTick}
            />
            : <div className={styles.normalComment}>- focus bend note on editor -</div>
          }
        </div>
      </div>

      <div className={styles.slideRowWrapper}>
        <div className={styles.slideWrapper}>
          { !slide
            ? <div className={styles.normalComment}>- focus slide note on editor -</div>
            : slide.viewType === SlideViewType.one
              ? <SlideLinerMiniOne slide={ slide } />
              : <SlideLinerMiniSome slide={ slide } />
              // : <>-wait-</>
          }
        </div>
      </div>

      <div className={styles.messageRowWrapper}>
        <div className={styles.messageWrapper}>
          Docs: https://
        </div>
      </div>
    </div>
  )
}
