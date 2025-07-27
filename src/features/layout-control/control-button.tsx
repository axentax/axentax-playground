import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../store/store';
import { PlayStatusEN, setPlayStatus } from '../../store/slice-play-status';
import { XSynth } from '../../synth/x-synth';
import { useRegionJumpByControl } from './use-region-jump';
import { EditorControl } from '../../editor/editor-control';
import { isEqual } from 'lodash';

import { FaPause, FaPlay, FaSpinner } from "react-icons/fa";
import { BiArrowFromTop } from "react-icons/bi";
import { LuArrowLeftToLine } from "react-icons/lu";
import { SiCompilerexplorer } from "react-icons/si";
import { DiYeoman } from "react-icons/di";
import { FaFileDownload } from "react-icons/fa";

import styles from './control-button.module.scss'
import { usePlayObserver } from '../../hooks/use-play-observer';
import { useKeyDown } from '../../hooks/use-key-down';
import { usePlayWithReCompile } from '../../hooks/use-play-with-re-compile';
import { ComposeX1 } from '../../@x-electron/compose/compose';

import { ConductStore } from '../../conduct/conduct-store';

export const ControlButton: React.FC = React.memo(() => {

  const playStatus = useSelector((state: RootState) => state.playStatus.status);
  const syntaxError = useSelector((state: RootState) => state.syntaxError.info);
  const versionMatched = useSelector((state: RootState) => state.syntaxMatchVersion.matched)

  const hasCompose = useSelector((state: RootState) => state.systemState.existAnnotationCompose, isEqual);

  const [stateRegionPrev, setStateRegionPrev] = useState<boolean>(false);
  const [stateRegionNext, setStateRegionNext] = useState<boolean>(false);

  const { playCB, stopCB } = usePlayObserver();
  const { reCompilePlayCB } = usePlayWithReCompile(playCB, stopCB);

  const { jumpToPrevRegion, jumpToNextRegion } = useRegionJumpByControl();
  // jumpToPrevRegion
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (stateRegionPrev) {
      jumpToPrevRegion();
    }
    if (stateRegionPrev) timer = setInterval(() => jumpToPrevRegion(), 90)
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stateRegionPrev]);

  // jumpToPrevRegion
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (stateRegionNext) jumpToNextRegion();
    if (stateRegionNext) timer = setInterval(() => jumpToNextRegion(), 90)
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [stateRegionNext]);

  // ---
  // play or stop or compile
  // ---
  const renderMainControlButton = () => {
    switch (playStatus) {
      case PlayStatusEN.PLAY:
        return (
          <div onClick={stopCB} className={`${styles.playPadding} ${styles.hoverHandle} gl-brightColor`}>
            <FaPause size='18px' />
          </div>
        )
      case PlayStatusEN.COMPILE:
        return (
          <div className={styles.playPadding}>
            <FaSpinner size='18px' className={`${styles.spinner} gl-brightColor`} />
          </div>
        )
      case PlayStatusEN.STOP:
        return syntaxError
          ? (
            <div className={styles.playPadding}>
              <FaPlay size='18px' className={styles.error} />
            </div>
          )
          : (
            <div onClick={playCB} className={`${styles.playPadding} ${styles.hoverHandle} gl-brightColor`} >
              <FaPlay size='18px' />
            </div>
          )
      default: throw 'ControlButton';
    }
  }

  let synthInited = false;

  // ---
  // re compile && play
  // ---
  const reCompileButton = () => {
    const dispatch = useDispatch();
    
    if (versionMatched || syntaxError || playStatus === PlayStatusEN.COMPILE) {
      return renderMainControlButton()
    } else {
      return (<>
        <div onClick={() => {
          if (!synthInited) {
            synthInited = true;
            dispatch(setPlayStatus(PlayStatusEN.COMPILE));
            XSynth.init(() => {
              reCompilePlayCB()
            });
          } else {
            reCompilePlayCB()
          }
        }} className={`${styles.playPadding} ${styles.hoverHandle} gl-brightColor`}>
          <SiCompilerexplorer size='20px' />
        </div>

        {
          playStatus !== PlayStatusEN.PLAY 
            ? (<></>)
            : (<div onClick={stopCB} className={`${styles.commonPadding} ${styles.hoverHandle} gl-brightColor`}>
              <FaPause size='18px' />
            </div>)
        }
      </>)
    }
  }

  // -- キー制御（再生ボタン）
  const playOrStop = () => {
    if (playStatus === PlayStatusEN.STOP) {
      playCB()
    } else if (playStatus === PlayStatusEN.PLAY) {
      stopCB()
    }
  }
  const reCompileWithPlay = () => {
    if (!XSynth.checkInstance()) {
      alert("When starting the game, please click the play button first.")
      return;
    } else if (!versionMatched && !syntaxError && playStatus !== PlayStatusEN.COMPILE) {
      reCompilePlayCB()
    } else {
      playOrStop()
    }
  }
  // useKeyDown(['s'], playOrStop, [{ metaKey: true }]);
  useKeyDown(['s'], reCompileWithPlay, [{ metaKey: true }]);
  useKeyDown([' '], reCompileWithPlay, [{ shiftKey: true }]);
  // useKeyDown([' '], playOrStop, [{ shiftKey: true }]);

  return (
    <div className={styles.flex}>

      {/* {renderMainControlButton()} */}

      {reCompileButton()}

      {
        playStatus === PlayStatusEN.COMPILE
          ? (<></>)
          : (
            <>
              <div className={`${styles.commonPadding} ${styles.hoverHandle} gl-brightColor`} onClick={() => {
                if (store.getState().statusOfSettings.followEditorLineWhenPlaying) {
                  EditorControl.jumpToLine(0);
                }
                XSynth.getInstance().setSeek(0);
              }}>
                <LuArrowLeftToLine size='25px' style={{ transform: 'scaleX(0.85)' }} />
              </div>
            </>
          )
      }
      {
        !versionMatched || playStatus === PlayStatusEN.COMPILE
          ? (<></>)
          : (
            <>
              <div className={`${styles.commonPadding} ${styles.hoverHandle} gl-brightColor`}
                onMouseDown={() => setStateRegionPrev(true)}
                onMouseUp={() => setStateRegionPrev(false)}
                onMouseLeave={() => setStateRegionPrev(false)}>
                <BiArrowFromTop size='25px' style={{ transform: 'scaleY(-1)' }} />
              </div>

              <div className={`${styles.commonPadding} ${styles.hoverHandle} gl-brightColor`}
                onMouseDown={() => setStateRegionNext(true)}
                onMouseUp={() => setStateRegionNext(false)}
                onMouseLeave={() => setStateRegionNext(false)}>
                <BiArrowFromTop size='25px' />
              </div>
            </>
          )
      }
      {
        !hasCompose || playStatus !== PlayStatusEN.STOP ? <></> : <>
          <div className={`${styles.commonPadding} ${styles.hoverHandle} gl-brightColor`} onClick={
            ()=>{
              ComposeX1.resolve()
            }
          }>
            <DiYeoman size='25px' />
          </div>
        </>
      }
      {
        !versionMatched ? <></> : <>
          <div className={`${styles.commonPadding} ${styles.hoverHandle} gl-brightColor`} onClick={
            () => {

              // midi download
              const midi = ConductStore.getPlayingMidi();
              if (midi) {

                // ArrayBuffer → Uint8Array → Blob に変換
                const uint8 = new Uint8Array(midi);
                const blob = new Blob([uint8], { type: 'audio/midi' });
                // 一時的なダウンロード用 URL を生成
                const url = URL.createObjectURL(blob);

                // a 要素を作って自動クリック
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Axentax_' + new Date().getTime() + '.mid';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // 解除
                URL.revokeObjectURL(url);
              }

            }
          }>
            <FaFileDownload size='20px' />
          </div>
        </>
      }
    </div>
  )

})
