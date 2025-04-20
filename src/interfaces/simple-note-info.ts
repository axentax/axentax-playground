import { NumberOrUfd } from "axentax-compiler";

export interface SimpleNoteInfo {
  startTick: number,
  endTick: number,
  velocity: number,
  fret: NumberOrUfd
}
