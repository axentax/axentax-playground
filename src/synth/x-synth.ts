import * as JSSynth from 'js-synthesizer';
import { XSynthInitializer } from './x-synth-initializer';
import store from '../store/store';
import { PlayStatusEN, setPlayStatus } from '../store/slice-play-status';
import { Thread } from '../utils/thread';
import { setPlayTick, setTotalTick } from '../store/slice-play-tick';
import { PlatformConfiguration } from '../settings';

const ObserveWaitTimeMS = 10;

export class XSynth {

  private static instance: XSynth;
  private synth: JSSynth.Synthesizer | null = null;
  private loopFlag = 0;
  /* eslint @typescript-eslint/no-explicit-any: off */
  private boundInitForListener: () => void = () => {};
  private afterCB: (() => void) | null = null;

  private lastStopTick = -1; // 

  /** --- */
  private constructor() { }

  /** --- */
  public static getInstance(): XSynth {
    if (!XSynth.instance) {
      throw 'no synth instance';
    }
    return XSynth.instance;
  }

  /** --- */
  public static init(afterCB: () => void) {
    if (!XSynth.instance) {
      XSynth.instance = new XSynth();
      XSynth.instance.afterCB = afterCB;
      const boundInitForListener = XSynth.initForListener.bind(XSynth.instance);
      XSynth.instance.boundInitForListener = boundInitForListener;
      document.addEventListener('click', boundInitForListener);
    } else {
      afterCB();
    }
  }

  public static initLocal(afterCB: () => void) {
    if (!XSynth.instance) {
      XSynth.instance = new XSynth();
      XSynth.instance.afterCB = afterCB;
      // const boundInitForListener = XSynth.initForListener.bind(XSynth.instance);
      // XSynth.instance.boundInitForListener = boundInitForListener;
      // document.addEventListener('click', boundInitForListener);
      this.initForListener()
    } else {
      afterCB();
    }
  }

  public static initForListener() {
    // console.log('synth init..');
    document.removeEventListener('click', XSynth.instance!.boundInitForListener);
    if (!XSynth.instance!.synth) {
      XSynthInitializer.init(PlatformConfiguration.assetsPath + '/data/TimGM6mb_slim2.sf2').then(res => {
        XSynth.instance!.synth = res;
        console.log('synth ready');
        if (XSynth.instance.afterCB) {
          XSynth.instance.afterCB();
        }
      });
    }
  }

  /** --- */
  public getSynth(): JSSynth.Synthesizer {
    return this.synth as JSSynth.Synthesizer;
  }

  /** --- */
  private async startSeekObserver() {
    const synth = this.synth;
    let total = 0;
    if (synth) {

      while (true) {
        if (total === 0) {
          synth.retrievePlayerTotalTicks().then(res => {
            store.dispatch(setTotalTick(res));
            total = res;
          });
        }
        synth.retrievePlayerCurrentTick().then(res => {
          if (this.lastStopTick !== res) {
            store.dispatch(setPlayTick(res));
            this.lastStopTick = res;
          }
        });
        if (!this.loopFlag) break;
        await Thread.sleep(ObserveWaitTimeMS);
      }

    }
  }

  public async setMidiFile(midi: ArrayBuffer | undefined) {
    const synth = this.synth;
    if (synth && midi) {
      synth.stopPlayer();
      synth.closePlayer();
      await synth.addSMFDataToPlayer(midi);
    }
  }

  /** --- */
  public async play(midi: ArrayBuffer | null | undefined, stopWhenCB: () => void) {

    const synth = this.synth;
    if (synth) {

      // 末端であればseekリセット
      if (await this.seekStatus() === 1) {
        this.resetSeek();
      }

      store.dispatch(setPlayStatus(PlayStatusEN.PLAY));
      if (midi) {
        synth.stopPlayer();
        synth.closePlayer();
        await synth.addSMFDataToPlayer(midi);
      }

      // play
      synth.playPlayer();
      this.loopFlag = 1;
      this.startSeekObserver();

      await synth.waitForPlayerStopped();
      await synth.waitForVoicesStopped();

      if (store.getState().playStatus.status !== PlayStatusEN.COMPILE) {
        store.dispatch(setPlayStatus(PlayStatusEN.STOP));
      }

      // setTimeout(() => {
        if (this.loopFlag === 1) this.loopFlag = 0;
        stopWhenCB();
      // }, 50);

      synth.stopPlayer();
    }
  }

  /** --- */
  public stop() {
    const synth = this.synth;
    if (synth) {
      synth.stopPlayer();
    }
  }

  /** --- */
  public setSeek(tick: number) {
    const synth = this.synth;
    if (synth) {
      synth.seekPlayer(tick);
      store.dispatch(setPlayTick(tick));
    }
  }

  /** --- */
  public resetSeek() {
    const synth = this.synth;
    if (synth) {
      synth.seekPlayer(0);
      store.dispatch(setPlayTick(0));
    }
  }

  /**
   * midiと再生位置
   * @returns 0: midi無し, 1: 末端, 2: 未開始, 3: pause, null: 例外
   */
  public async seekStatus(): Promise<number | null> {
    const synth = this.synth;
    if (synth) {
      const len = await synth.retrievePlayerTotalTicks();
      const now = await synth.retrievePlayerCurrentTick();
      if (len !== 0) {
        // midiある
        if (len <= now) {
          // 末端
          return 1;
        } else if (now === 0) {
          // 未開始
          return 2;
        } else {
          // pause
          return 3;
        }
      } else {
        // midi未セット
        return 0;
      }
    }
    return null;
  }

}
