import React, { useCallback, useState } from 'react'
import { XSynth } from '../../synth/x-synth'
import { useDispatch, useSelector } from 'react-redux'
import { StrumEditor } from '../../editor/editor'
import { ConsoleStepOverlay } from './step-overlay'
import { LayoutTimeline } from '../layout-timeline/layout-timeline'
import { Controller } from '../layout-control/layout-controller'
import { RootState } from '../../store/store'
import { LayoutControlBottom } from '../layout-control-bottom/control-bottom'
import { useColumnController } from './use-column-controller'
import { LayoutTitle } from '../layout-title/layout-title'

import styles from './layout-console.module.scss';
import { FingerBoardLabo } from '../finger-board-labo/finger-board-labo'
import { SyntaxError } from '../syntax-error/syntax-error'
import { LayoutLabo } from '../layout-labo/layout-labo'
import { PlatformConfiguration } from '../../settings'
import { LSItemName, LSRepo } from '../../repository/local-storage-repo'
import { updateFileProp } from '../../store/file-state/slice-file-prop'
import { updateSystemState } from '../../store/status-of-settings/slice-system-status'

// import logo from './axentax-logo.png';

export const LayoutConsole: React.FC = React.memo(() => {
  const dispatch = useDispatch();

  // const playStatus = useSelector((state: RootState) => state.playStatus);
  const [overlayLevel, setOverlayLevel] = useState(0); // for initial time overlay

  const fullScreenState = useSelector((state: RootState) => state.windowControl.fullScreen);
  const leftColumnState = useSelector((state: RootState) => state.windowControl.leftColumn);
  const rightColumnState = useSelector((state: RootState) => state.windowControl.rightColumn);
  const {
    leftColumnWidth,
    rightColumnWidth,
    // handleMouseDownRight,
  } = useColumnController(5, PlatformConfiguration.defaultRightColumnWidth);

  const syntaxError = useSelector((state: RootState) => state.syntaxError);

  // when editor mounted
  const mountedEditorCB = useCallback(() => { // monacoマウント時
    setOverlayLevel(1);

    try {
      const _fileProp = LSRepo.getItem(LSItemName.FileProp);
      if (_fileProp) {
        setTimeout(() => {
          const fileProp = JSON.parse(_fileProp);
          dispatch(updateFileProp(fileProp));
          dispatch(updateSystemState({ key: 'initializedSystem', value: true }))
        }, 200);
      } else {
        dispatch(updateSystemState({ key: 'initializedSystem', value: true }))
      }
    } catch {
      //
    }
  }, []);

  return (
    <>
      {/* --- Overlay for Initialize --- */}
      
      {overlayLevel === 0 ? <ConsoleStepOverlay>🔥 initial console 🔥</ConsoleStepOverlay> : null}
      {overlayLevel === 1 ? <ConsoleStepOverlay
        backgroundColor='rgba(0, 0, 0, 0.75)'
        onClick={() => {
          setOverlayLevel(2);
          XSynth.init(() => { setOverlayLevel(3) });
        }}>
          🔥 Click to Start 🔥
        </ConsoleStepOverlay> : null}
      {overlayLevel === 2 ? <ConsoleStepOverlay backgroundColor='rgba(0, 0, 0, 0.75)'>💥 initial synth 💥</ConsoleStepOverlay> : null}

      {/* --- Console Window --- */}
      <div className={`${styles.fullHeight}`}>

        <header className={`${styles.headerFooter} ${styles.header}`}>
        </header>

        <section id="title-box" className={`${styles.box} ${styles.titleBox}`}>
          <LayoutTitle />
        </section>

        <div className={`${styles.container} areaBorderBottom `}>

          {/* Left */}
          <div id="left-column" className={`
            ${styles.column}
            ${styles.leftColumn}`}
            style={{
              display: leftColumnState
                ? 'block'
                : 'none', width: `${leftColumnWidth}px`
            }}>
          </div>
          {/* <div id="resizer-left" className={styles.resizer} onMouseDown={handleMouseDownLeft}></div> */}


          {/* Main */}
          <div id="main-column" className={`${styles.column} ${styles.mainColumn}`}>

            <section className={`${styles.box} ${styles.controlArea}`}>
              <Controller />
            </section>

            <section className={`areaBorderBottom`} style={{
              display: !fullScreenState
                ? 'block'
                : 'none'
            }}>
              <FingerBoardLabo />
            </section>

            <section className={`${styles.box} ${styles.editorBox} areaBorderBottom`}>
              <StrumEditor {...{ mountedCB: mountedEditorCB }} />
            </section>

            {
              !syntaxError.info ? null : <SyntaxError />
            }

            <section className={`${styles.box} ${styles.controlBottomArea} areaBorderBottom`}>
              <LayoutControlBottom />
            </section>

          </div>

          {/* Right */}
          {/* <div id="resizer-right" className={styles.resizer} onMouseDown={handleMouseDownRight}></div> */}
          <div id="right-column" className={`
            ${styles.column}
            ${styles.rightColumn}`}
            style={{
              display: rightColumnState
                ? 'block'
                : 'none', width: `${rightColumnWidth}px`
            }}>
            <div>
              <LayoutTimeline />
            </div>
            <div>
              <LayoutLabo />
            </div>
          </div>

        </div>

        <footer className={`${styles.headerFooter} ${styles.footer}`}>
          © 2025 AXENTAX.COM
        </footer>
      </div>

    </>
  );

});
