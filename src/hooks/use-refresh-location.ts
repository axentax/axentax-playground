import store, { RootState } from "../store/store";
import { useCallback, useRef } from "react";
import { CursorLocation } from "../store/slice-cursor-location";
import { bdView, Conduct, CSymbolType, inView, LocationInfo, NumberOrUfd, Styles, TabObj, Tick, toView } from "axentax-compiler";
import { clearScale, IScale, setScale } from "../store/cur-location-view/slice-cl-scale";
import { useDispatch } from "react-redux";
import { RefreshLocationService as RLS } from "./util.refresh-location";
import { clearBraceStyles, IBraceStyles, setBraceStyles } from "../store/cur-location-view/slice-cl-brace-styles";
import { clearNotes, INotes, setNotes } from "../store/cur-location-view/slice-cl-notes";
import { clearBlockStyles, IBlockStyle, setBlockStyles } from "../store/cur-location-view/slice-cl-block-style";
import { useSubscribe } from "./use-subscribe";

import { isEqual } from 'lodash';
import { clearClRegion, IClRegion, setClRegion } from "../store/cur-location-view/slice-cl-region";
import { clearNoteStyle, INoteStyle, setNoteStyle } from "../store/cur-location-view/slice-cl-note-style";
import { clearClBend, IClBend, setClBend } from "../store/cur-location-view/slice-cl-bend";
import { SimpleNoteInfo } from "../interfaces/simple-note-info";
import { clearClSlide, IClSlide, setClSlide } from "../store/cur-location-view/slice-cl-slide";
import { SlideViewData, SlideViewType } from "../interfaces/slide-view-data";
import { XViewUtils } from "../utils/utils";

/*
  store
    ■cursor-view
      note(on cursor)
        - regionId, dualId, tabObjId, locationInfoId
        - noteSym, chord, tab, until、tick, activeBows
        - style(常時(重)) .. scale, key
        - style(常時(中)) .. legato, slide, approach, stroke
        - style(常時(小)) .. delay, staccato, strum, inst, continue
        - style(選択) .. step
        - style(選択) .. map
        - style(選択) .. bpm

      region(on cursor)
        - dualId毎の {
          until,
          bpm,
          tuning,
          regionの開始・終了・総計tick
        }
        extension-view
          - region内の想定スケール
      block
        - 選択中のstyle
      global
*/

export interface CLView {
  bendData: IClBend,
  blockStyle: IBlockStyle,
  braceStyles: IBraceStyles,
  noteStyle: INoteStyle,
  notes: INotes,
  scale: IScale,
  slideData: IClSlide,
  region: IClRegion
}

function searchStepLocation(ctl: TabObj[], cursor: CursorLocation): number {
  // for (let ti = ctl.length - 1; ti >= 0; ti--) {
  for (let ti = 0; ti < ctl.length; ti++) {
    const to = ctl[ti];
    if (
      to.syntaxLocation.line === cursor.line
      && to.syntaxLocation.linePos < cursor.column && cursor.column <= to.syntaxLocation.endPos) {
      return ti;
    }
  }
  return -1;
}

export const useRefreshCursorLocation = () => {

  // // --- devモードで変更が反映されない対策であるためproduction時はコメントアウト
  // const _reloaderForDev_ = useSelector((state: RootState) => state.cursorLocation);
  // useEffect(() => {
  //   // ファイルから呼んでいる事実があればdevのhotReload対象になるらしい
  //   if (import.meta.env.DEV) refreshLocationCB();
  //   return () => { }
  // }, [_reloaderForDev_]);
  // // --- ここまで

  const dispatch = useDispatch(); // 加工後のデータ挿入用
  const cursor = useRef<CursorLocation | null>(null);
  const unStyleConduct = useRef<Conduct | null>(null);

  useSubscribe<CursorLocation>(
    (state: RootState) => state.cursorLocation,
    (cursorLocation: CursorLocation) => {
      cursor.current = cursorLocation;
    }
  );

  /**
   * カーソル位置のsym情報を更新する
   */
  const refreshLocationCB = useCallback((conduct?: Conduct) => {
    // データ更新
    if (conduct) {
      unStyleConduct.current = conduct;
    }

    // データなければ処理なし（実際は最後の成功データが居座り続ける。※暗転的なアプローチでも良い）
    if (!unStyleConduct.current || !cursor.current) return;

    const error = store.getState().syntaxError.info;
    if (error !== null) {
      return;
    }

    // Conduct to view
    const clView = step1_findLocationInfoWithReturnedTabObj(unStyleConduct.current, cursor.current);

    // 結果からstoreに反映

    if (!isEqual(clView.scale, store.getState().currentScale)) {
      dispatch(clView.scale ? setScale(clView.scale) : clearScale());
    }

    if (!isEqual(clView.braceStyles, store.getState().currentBraceStyles)) {
      dispatch(clView.braceStyles ? setBraceStyles(clView.braceStyles) : clearBraceStyles());
    }

    if (!isEqual(clView.blockStyle, store.getState().currentBlockStyle)) {
      dispatch(clView.blockStyle ? setBlockStyles(clView.blockStyle) : clearBlockStyles());
    }

    if (clView.notes) {
      if (!isEqual(clView.notes, store.getState().currentNotes)) {
        // if (clView.noteStyle) {
        //   clView.notes.tab = clView.notes.trueTab
        // }
        dispatch(setNotes(clView.notes));
      }
    } else {
      dispatch(clearNotes());
    }

    // region
    if (clView.region?.region && !isEqual(clView.region.region, store.getState().clRegion.region)) {
      dispatch(clView.region.region ? setClRegion(clView.region.region) : clearClRegion());
      // tuningは別
      // if (clView.region.tuning && !isEqual(clView.region.tuning, store.getState().clRegion.tuning)) {
      //   dispatch(setClTuning(clView.region.tuning));
      // }
    }

    // noteStyle
    if (!isEqual(clView.noteStyle, store.getState().currentNoteStyle)) {
      dispatch(clView.noteStyle ? setNoteStyle(clView.noteStyle) : clearNoteStyle());
    }

    // bend
    dispatch(clView.bendData ? setClBend(clView.bendData.bend) : clearClBend());
    // slide
    dispatch(clView.slideData ? setClSlide(clView.slideData.slide) : clearClSlide());

  }, [])

  return { refreshLocationCB }
}

/**
 * step1: カーソル位置からview用の情報取得
 */
function step1_findLocationInfoWithReturnedTabObj(conduct: Conduct, cursor: CursorLocation): CLView {
  const clView: CLView = {} as CLView;

  // console.clear();

  // locationInfoListから note等の主要symbol 検索
  const locationInfoIndex = RLS.searchLocationInfo(conduct, cursor);
  if (locationInfoIndex !== null) {
    // ---
    // --- locationInfoListでマッチした場合
    // ---
    const locationInfo = conduct.locationInfoList[locationInfoIndex];
    // CLViewを作成（type別に解決）
    step2_solvedByDistributingTypes(conduct, clView, cursor, locationInfo, locationInfoIndex);
  } else {
    // ---
    // --- locationInfoListでマッチしない
    // ---
    const braceStyles = RLS.getBraceStyles(conduct, clView, cursor);
    if (braceStyles) {
      // CLViewを作成（braceStyles, region/dualId 等々の把握可能なものだけ反映）
      step2_2_blockAnyLocation(conduct, clView, braceStyles)
    }

    findRegion(conduct, clView, cursor)

  }
  return clView;
}

/**
 * step2(B): カーソル位置から詳細情報取得（symにマッチしていない場合）
 * @param conduct 
 * @param clView 
 * @param braceStyles 
 */
function step2_2_blockAnyLocation(conduct: Conduct, clView: CLView, braceStyles: Styles) {
  // scale
  clView.scale = RLS.getScaleFromBraceStyles(conduct, braceStyles);

  // TODO: region情報
  // ..
}



/**
 * カーソル位置のsymに該当する詳細情報取得
 * @param conduct 
 * @param cursor 
 * @param loInfo 
 * @return
 */
function step2_solvedByDistributingTypes(conduct: Conduct, clView: CLView, cursor: CursorLocation, loInfo: LocationInfo, li: number) {
  // const region = conduct.mixesList[loInfo.dualId].regionList[loInfo.regionId];

  // typeによって処理が変わる
  switch (loInfo.type) {

    // ---
    // --- note
    // ---
    case (CSymbolType.note): {
      // region
      getRegion(conduct, clView, loInfo);
      // brace
      const braceStyles = RLS.getBraceStyles(conduct, clView, cursor);
      // 全てのtabObj
      const currentToList = conduct.mixesList[loInfo.dualId].flatTOList.filter(to => to.locationIndexes?.includes(li));
      if (!currentToList.length) return;
      // scale
      RLS.getScaleFromTabObj(conduct, clView, currentToList[0], braceStyles);

      // style（stepの場合、tabにtrueTabを充てるため必要 ※stepの場合、最初のstepSymの弦だけがtabに設定されるためviewで使いずらい対応）
      // ### 多分取れてない
      const styles = RLS.getStyleFromStyleObjectBank(conduct, loInfo);
      clView.noteStyle = { styles };


      const matchTabObjIndex = searchStepLocation(currentToList, cursor);
      const matchedCurrentTo = currentToList[matchTabObjIndex < 0 ? 0 : matchTabObjIndex];

      // note
      getNoteProp(clView, matchedCurrentTo); //currentToList[0]);

      // #step最初だけしかtabにならない対応
      if (matchTabObjIndex === -1 && currentToList[0].isArpeggio) {
        // step.symが見つからなかった場合
        clView.notes.tab = clView.notes.activeBows = findStepAllTab(currentToList);
      }

      // bend
      if (currentToList[0].styles.bd) {
        // console.log("##>>>", currentToList[0].bar, currentToList[0].styles.bd)
        const bend = bdView(currentToList[0].bar, currentToList[0].styles.bd);
        if (bend.length) clView.bendData = { bend }
      }

      resolveSlideAndApproach(
        conduct,
        loInfo.dualId,
        currentToList,
        matchTabObjIndex,
        matchedCurrentTo,
        clView
      );

      break;
    }

    // ---
    // --- bullet
    // ---
    case (CSymbolType.bullet): {
      // region
      getRegion(conduct, clView, loInfo);
      // brace
      const braceStyles = RLS.getBraceStyles(conduct, clView, cursor);
      // console.log('brace', braceStyles)
      // 全てのtabObj
      const currentToList = conduct.mixesList[loInfo.dualId].flatTOList.filter(to => to.locationIndexes?.includes(li));
      if (!currentToList.length) return;
      // scale
      RLS.getScaleFromTabObj(conduct, clView, currentToList[0], braceStyles);
      // bullet location
      const searchBulletLocation = (ctl: TabObj[], cursor: CursorLocation): number => {
        for (let ti = 0; ti < ctl.length; ti++) {
          const to = ctl[ti];
          if (
            to.syntaxLocation.line === cursor.line
            && to.syntaxLocation.linePos <= cursor.column && cursor.column <= to.syntaxLocation.endPos) {
            return ti;
          }
        }
        return -1;
      }
      const matchTabObjIndex = searchBulletLocation(currentToList, cursor);
      const matchedCurrentTo = currentToList[matchTabObjIndex < 0 ? 0 : matchTabObjIndex];

      // note
      getNoteProp(clView, matchedCurrentTo);

      if (matchTabObjIndex === -1) {
        const sym = (clView.notes.noteSym || '-').replace(/^.+?>>|:.+?$/sg, '');
        clView.notes.chord = sym.length > 22 ? sym.substring(0, 20) + '..' : sym;
      }

      // bend
      if (matchedCurrentTo?.styles.bd) {
        const bend = bdView(matchedCurrentTo.bar, matchedCurrentTo.styles.bd);
        if (bend.length) clView.bendData = { bend }
      }

      resolveSlideAndApproach(
        conduct,
        loInfo.dualId,
        currentToList,
        matchTabObjIndex,
        matchedCurrentTo,
        clView
      );

      break;
    }

    // ---
    // --- degree
    // ---
    case (CSymbolType.degreeName): {
      // region
      getRegion(conduct, clView, loInfo);
      // brace
      const braceStyles = RLS.getBraceStyles(conduct, clView, cursor);
      // 全てのtabObj
      const currentToList = conduct.mixesList[loInfo.dualId].flatTOList.filter(to => to.locationIndexes?.includes(li));
      if (!currentToList.length) return;
      // scale
      RLS.getScaleFromTabObj(conduct, clView, currentToList[0], braceStyles);

      const matchTabObjIndex = searchStepLocation(currentToList, cursor);
      const matchedCurrentTo = currentToList[matchTabObjIndex < 0 ? 0 : matchTabObjIndex];

      // note
      getNoteProp(clView, matchedCurrentTo); //currentToList[0]);

      // #step最初だけしかtabにならない対応
      if (currentToList[0].shifted) {
        // const matchTabObjIndex = searchStepLocation(currentToList, cursor);
        if (matchTabObjIndex === -1) clView.notes.tab = clView.notes.activeBows = findStepAllTab(currentToList);
      }

      // bend
      if (currentToList[0].styles.bd) {
        const bend = bdView(currentToList[0].bar, currentToList[0].styles.bd);
        if (bend.length) clView.bendData = { bend }
      }

      resolveSlideAndApproach(
        conduct,
        loInfo.dualId,
        currentToList,
        matchTabObjIndex,
        matchedCurrentTo,
        clView
      );

      // console.log('note', currentToList[0]); // $v$
      // console.log('brace', braceStyles); // $v$
      break;
    }

    // ---
    // --- style
    // ---
    case (CSymbolType.style): {
      // region
      getRegion(conduct, clView, loInfo);
      // brace
      const braceStyles = RLS.getBraceStyles(conduct, clView, cursor);
      // 全てのtabObj
      const currentToList = conduct.mixesList[loInfo.dualId].flatTOList.filter(to => to.locationIndexes?.includes(li));
      if (!currentToList.length) return;

      // scale
      RLS.getScaleFromTabObj(conduct, clView, currentToList[0], braceStyles);
      // style
      const styles = RLS.getStyleFromStyleObjectBank(conduct, loInfo);
      clView.noteStyle = { styles };
      // console.log('noteStyle>>', styles, currentToList); // $v$

      const matchTabObjIndex = searchStepLocation(currentToList, cursor);
      const matchedCurrentTo = currentToList[matchTabObjIndex < 0 ? 0 : matchTabObjIndex];

      getNoteProp(clView, matchedCurrentTo);

      // #step最初だけしかtabにならない対応
      if (matchTabObjIndex === -1 && currentToList[0].isArpeggio) {
        // step.symが見つからなかった場合
        clView.notes.tab = clView.notes.activeBows = findStepAllTab(currentToList);
      }
      // else {} // step.symの場合

      if (matchedCurrentTo.isBullet) {
        const sym = (clView.notes.noteSym || '-').replace(/:.+?$/sg, '');
        clView.notes.chord = sym.length > 22 ? sym.substring(0, 20) + '..' : sym;
      }

      // bend
      if (matchedCurrentTo.styles.bd) {
        const bend = bdView(matchedCurrentTo.bar, matchedCurrentTo.styles.bd);
        if (bend.length) clView.bendData = { bend }
      }

      resolveSlideAndApproach(
        conduct,
        loInfo.dualId,
        currentToList,
        matchTabObjIndex,
        matchedCurrentTo,
        clView
      );

      break;
    }

    // ---
    // --- block style
    // ---    
    case (CSymbolType.blockStyle): {
      // region
      getRegion(conduct, clView, loInfo);
      // block style
      const blockStyle = RLS.getStyleFromStyleObjectBank(conduct, loInfo);
      clView.blockStyle = { styles: blockStyle };

      if (blockStyle.scaleX) {
        clView.scale = {
          isValid: true,
          name: blockStyle.scaleX.key + ' ' + blockStyle.scaleX.scale,
          key: blockStyle.scaleX.key,
          bin: blockStyle.scaleX.bin
        }
      }

      if (blockStyle.bd) {
        const bend = bdView({
          startTick: 480,
          stopTick: 2400,
          fretStartTicks: [480],
          fretStopTicks: [2400],
          tick: 1920
        } as Tick, blockStyle.bd);
        clView.bendData = { bend }
        // console.log(bend)
      }

      // console.log('blockStyle', blockStyle);

      break;
    }

    // ---
    // --- region start
    // ---
    case (CSymbolType.regionStart): {
      // console.log('region start', loInfo.sym, loInfo.regionId, loInfo.dualId);
      getRegion(conduct, clView, loInfo);
      break;
    }

    // ---
    // --- region prop
    // ---
    case (CSymbolType.regionProp): {
      // console.log('region prop', loInfo.sym, loInfo.regionId, loInfo.dualId);
      getRegion(conduct, clView, loInfo);
      break;
    }

    // ---
    // --- flash
    // ---
    case (CSymbolType.flash): {
      getRegion(conduct, clView, loInfo);
      // console.log('flash', loInfo);
      break;
    }

    // throw
    default: {
      throw 'noteにもスタイルにもblockスタイルにも何にも当たっていない'
    }
  }

}

function findStepAllTab(toList: TabObj[]) {
  const allStepTab = [...toList[0].tab];
  const firstShifted = toList[0].shifted ? toList[0].shifted[0].shift : undefined;
  // console.log('firstShifted', firstShifted)
  for (let ti = 0; ti < toList.length; ti++) {
    const to = toList[ti]
    const currentShifted = to.shifted ? to.shifted[0].shift : undefined;
    if (currentShifted !== firstShifted) break;
    to.tab.forEach((fret, i) => {
      if (fret !== undefined && fret >= 0) {
        allStepTab[i] = fret
      }
    })
  }
  return allStepTab;
}

/**
 * find region
 * @param conduct 
 * @param clView 
 * @param cursor 
 * @returns 
 */
function findRegion(conduct: Conduct, clView: CLView, cursor: CursorLocation) {

  for (let dualId = 0; dualId < conduct.mixesList.length; dualId++) {
    const regionList = conduct.mixesList[dualId].regionList;
    for (let ri = 0; ri < regionList.length; ri++) {
      const region = regionList[ri];

      // @@ {} >> のように中途半端なdualBlockの場合、region.endがない場合がある対応
      if (!region.start || !region.end) continue;

      const target = {
        line: region.start.line,
        linePos: region.start.linePos,
        endLine: region.end.line,
        endPos: region.end.linePos
      }

      if (cursor.line < target.line || target.endLine < cursor.line) {
        continue;
      }
      // カーソルと行一致
      if (target.line === target.endLine) {
        // 単数行のlocationInfoに一致
        if (target.linePos <= cursor.column && cursor.column < target.endPos) {
          clView.region = {
            region,
            // tuning: region.tuning
          };
          return;
        }
      } else {
        // 複数行のlocationInfoに一致
        if (target.line === cursor.line && target.linePos <= cursor.column
          || target.endLine === cursor.line && cursor.column < target.endPos
          || target.line < cursor.line && cursor.line < target.endLine
        ) {
          clView.region = {
            region,
            // tuning: region.tuning
          };
          return;
        }
      }


    }
  }
}

/**
 * region
 * @param conduct 
 * @param clView 
 * @param loInfo 
 */
function getRegion(conduct: Conduct, clView: CLView, loInfo: LocationInfo) {
  const region = conduct.mixesList[loInfo.dualId].regionList[loInfo.regionId];
  clView.region = {
    region,
    // tuning: region.tuning
  };
}

/**
 * viewで使用するnoteデータの抽出
 * noteSym, chord, tab, until、tick, activeBows
 */
function getNoteProp(clView: CLView, to: TabObj) {
  /*
   use-refresh-location.ts:476 Uncaught TypeError: Cannot read properties of undefined (reading 'tabObjId')
    at getNoteProp (use-refresh-location.ts:476:18)
  */
  if (!to) return;
  const afterNotes: INotes = {
    tabObjId: to.tabObjId,
    isValid: true,
    noteSym: to.noteStr,
    chord: to.note,
    tab: to.tab,
    trueTab: to.trueTab || to.tab,
    activeBows: to.activeBows,
    until: to.untilNext,
    tick: to.bar,
    style: to.styles,
    // slideLandingTab: to.slideLandingTab
  };

  clView.notes = afterNotes;
}


/**
 * approach & slide
 * @param conduct 
 * @param dualId 
 * @param currentToList 
 * @param matchTabObjIndex 
 * @param matchedCurrentTo 
 * @param clView 
 * @returns 
 */
function resolveSlideAndApproach(
  conduct: Conduct,
  dualId: number,
  currentToList: TabObj[],
  matchTabObjIndex: number,
  matchedCurrentTo: TabObj,
  clView: CLView
) {

  // tabObj approach/slide
  const slideTo = matchTabObjIndex === -1
    ? currentToList.find(f => f.styles.slide !== undefined)
    : matchedCurrentTo;
  const approachTo = matchTabObjIndex === -1
    ? currentToList.find(f => f.styles.approach !== undefined)
    : matchedCurrentTo;
  if (!slideTo && !approachTo) return;

  // resolve
  const ttoRes = slideTo && slideTo.styles.slide
    ? toView(conduct, conduct.mixesList[dualId].marks, slideTo, slideTo.styles.slide!)
    : null;

  if (
    ttoRes && slideTo && approachTo
    && approachTo.styles.approach
    && slideTo.tabObjId === approachTo.tabObjId
  ) {
    const mixRes = inView(
      conduct,
      conduct.mixesList[dualId].marks,
      ttoRes[0],
      approachTo.styles.approach,
      ttoRes
    );
    if (mixRes) {
      // console.log(mixRes)
      // どちらもあり(approachは処理後に結果がない可能性もある)、且つIDが一致する"通常混合状態"
      clView.slideData = { slide: slideToViewData(mixRes, SlideViewType.one) };
    }
  } else {
    const atoRes = approachTo && approachTo.styles.approach
      ? inView(conduct, conduct.mixesList[dualId].marks, approachTo, approachTo.styles.approach)
      : null;
    if (ttoRes && ttoRes.length && (!atoRes || !atoRes.length)) {
      // slideのみ
      clView.slideData = { slide: slideToViewData(ttoRes, SlideViewType.one) };
    } else if (atoRes && atoRes.length && (!ttoRes || !ttoRes.length)) {
      // approachのみ
      clView.slideData = { slide: slideToViewData(atoRes, SlideViewType.one) };
    } else {
      if (!ttoRes || !atoRes) return;
      // どちらもあるがIDが一致しない、分離状態
      clView.slideData = { slide: slideToViewData([...atoRes, ...ttoRes], SlideViewType.some) };
    }
  }

}

// function findNumber(numberOrUndefinedList: NumberOrUfd[]) {
//   return numberOrUndefinedList.find(f => f !== undefined && f >= 0);
// }

/**
 * approachとslide結果からview用データ作成
 * @param mixRes 
 * @param viewType 
 * @returns 
 */
function slideToViewData(mixRes: TabObj[], viewType: SlideViewType): SlideViewData {

  const fn = XViewUtils.findNumber;

  // console.log(mixRes, viewType)

  const slides: SlideViewData = {
    approachList: [] as SimpleNoteInfo[],
    slideList: [] as SimpleNoteInfo[],
    viewType: viewType
  } as SlideViewData;

  let atoLastFret: NumberOrUfd = undefined;
  let ttoTrueFret: NumberOrUfd = undefined;
  let ttoLastFret: NumberOrUfd = undefined;

  // 推移list作成
  mixRes.forEach((to) => {

    // --- '#approach'note
    if (to.slideTrueType === 4) {
      const startTick = fn(to.bar.fretStartTicks); //.find((f => f !== undefined));
      const endTick = fn(to.bar.fretStopTicks); // .find((f => f !== undefined));
      const velocity = to.velocity.find((f => f !== undefined)) || 0; // 0|:step(123):to のような sym.3 の弦指定がない場合 velocity は全て undefined になってしまう暫定対応
      const fret = fn(to.tab); // to.tab.find(f => f !== undefined);
      if (startTick !== undefined && endTick !== undefined && velocity !== undefined) {
        slides.approachList.push({ startTick, endTick, velocity, fret: fret });
        if (!slides.totalStartTick) slides.totalStartTick = startTick;
        slides.middleStartTick = endTick;

        atoLastFret = fn(to.tab); // to.tab.find(f => f !== undefined);
      }
    }
    // --- true'slide'or'approach' for one
    else if (
      slides.viewType === SlideViewType.one
      && (to.slideTrueType === 1 || to.slideTrueType === 2)
    ) {
      if (!slides.totalStartTick) slides.totalStartTick = fn(to.bar.fretStartTicks) || to.bar.startTick;
      if (!slides.middleStartTick) slides.middleStartTick = to.bar.startTick;
      slides.totalEndTick = to.bar.stopTick;
      slides.middleEndTick = fn(to.bar.fretStopTicks) || to.bar.stopTick;
      const fret = fn(to.tab);
      if (fret !== undefined && atoLastFret !== undefined) {
        slides.approachUp = fret > atoLastFret;
      }
      ttoTrueFret = fret;
    }
    // --- true'approach' for some
    else if (slides.viewType === SlideViewType.some && to.slideTrueType === 2) {
      slides.middleEndTick = to.bar.stopTick;

      const fret = fn(to.tab);
      if (fret !== undefined && atoLastFret !== undefined) {
        slides.approachUp = fret > atoLastFret;
      }
    }
    // --- true'slide' for some
    else if (slides.viewType === SlideViewType.some && to.slideTrueType === 1) {
      slides.middleStartTick = to.bar.startTick;
      ttoTrueFret = fn(to.tab) || fn(to.activeBows);
    }
    // --- '#slide'note
    else if (to.slideTrueType === 3) {
      const startTick = to.bar.fretStartTicks.find((f => f !== undefined));
      const endTick = to.bar.fretStopTicks.find((f => f !== undefined));
      const velocity = to.velocity.find((f => f !== undefined)) || 1; // 0|:step(123):to のような sym.3 の弦指定がない場合 velocity は全て undefined になってしまう暫定対応
      const fret = to.tab.find(f => f !== undefined);
      if (startTick !== undefined && endTick !== undefined && velocity !== undefined) {
        slides.slideList.push({ startTick, endTick, velocity, fret: fret })
        slides.totalEndTick = endTick;
      }
      ttoLastFret = fret;
    }

  });

  if (ttoTrueFret !== undefined && ttoLastFret !== undefined) {
    slides.slideUp = ttoTrueFret < ttoLastFret;
  }

  //
  if (slides.slideList.length && slides.middleEndTick > slides.slideList[0].startTick) {
    slides.middleEndTick = slides.slideList[0].startTick;
  }

  // console.log('slides', slides)
  return slides;
}
