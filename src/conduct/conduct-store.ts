import { Conduct } from "axentax-compiler";
import store from "../store/store";
import { setSyntaxMatchedVersion } from "../store/slice-syntax-matched-version";
import { XViewUtils } from "../utils/utils";

export class ConductStore {

  private playingObj: Conduct | null = null;
  private playingVersion: number = -1;
  private playingSyntax: string | null = null;
  private editingVersion: number = 0;
  private playingMidi: ArrayBuffer | undefined;

  private static instance: ConductStore;
  private constructor() { }

  static setPlayingMidi(midi: ArrayBuffer | undefined) {
    if (!this.instance) this.instance = new ConductStore();
    this.instance.playingMidi = midi;
  }

  static getPlayingMidi(): ArrayBuffer | undefined {
    if (!this.instance) this.instance = new ConductStore();
    return this.instance.playingMidi;
  }

  static setPlayObj(conduct: Conduct | null) {
    if (!this.instance) this.instance = new ConductStore();
    this.instance.playingObj = conduct;
  }

  static getPlayObj() {
    if (!this.instance) this.instance = new ConductStore();
    return this.instance.playingObj;
  }

  static setPlayingSyntax(syntax: string | null) {
    if (!this.instance) this.instance = new ConductStore();
    if (syntax) {
      this.instance.playingSyntax = XViewUtils.removeUnnecessaryInitials(syntax);
    }
  }

  static comparisonPlayingSyntax(syntax: string) {
    if (!this.instance) this.instance = new ConductStore();
    return this.instance.playingSyntax === syntax ? true : false;
  }

  static incrementEditVersion() {
    if (!this.instance) this.instance = new ConductStore();
    this.instance.editingVersion++;
    this.dispatchVersionMatched();
    // console.log(`ver: edit:${this.instance.editingVersion}, play:${this.instance.playingVersion}`)
  }

  static setVersionOfEditToPlay() {
    if (!this.instance) this.instance = new ConductStore();
    this.instance.playingVersion = this.instance.editingVersion;
    this.dispatchVersionMatched();
    // console.log(`ver: edit:${this.instance.editingVersion}, play:${this.instance.playingVersion}`)
  }

  private static dispatchVersionMatched() {
    if (!this.instance) this.instance = new ConductStore();
    const matched = this.instance.editingVersion === this.instance.playingVersion;
    const matchedOfStore = store.getState().syntaxMatchVersion.matched;
    if (matched !== matchedOfStore) {
      store.dispatch(setSyntaxMatchedVersion({ matched: matched }));
    }
  }

}
