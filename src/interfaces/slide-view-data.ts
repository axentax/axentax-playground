import { SimpleNoteInfo } from "./simple-note-info";

export enum SlideViewType {
  /** 通常 */
  one,
  /** stepやbulletで複数noteに渡る場合 */
  some
}

/**
 * case one
 * 
 * case some
 *   totalStartTick ~ middleEndTick が approach の全体長
 *   middleStartTick ~ totalEndTick が slide の全体長
 */
export interface SlideViewData {
  /** 中間note（主note）の開始 # someの場合middleEndはslide専用 */
  middleStartTick: number,
  /** 中間note（主note）の終了 # someの場合middleEndはapproach専用*/
  middleEndTick: number,
  /** 全体長 */
  totalStartTick: number,
  totalEndTick: number,
  /**  */
  velocity: number,
  /**  */
  approachList: SimpleNoteInfo[],
  approachUp: boolean,
  // approachStartFret: NumberOrUfd,
  /**  */
  slideList: SimpleNoteInfo[],
  slideUp: boolean;
  // slideLastFret: NumberOrUfd,
  /**  */
  viewType: SlideViewType;
}
