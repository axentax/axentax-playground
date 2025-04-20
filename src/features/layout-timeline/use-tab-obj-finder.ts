import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { TabObj } from "axentax-compiler";
import { useSubscribe } from "../../hooks/use-subscribe";
import { useEffect, useRef } from "react";

import { updateSymArrObj } from "../../store/cur-play-view/slice-cur-play-sym";
import { updatePlayBPM } from "../../store/slice-play-bpm";
import { updatePlayRegion } from "../../store/slice-play-region";
import { EditorControl } from "../../editor/editor-control";
import { EditorInstanceStore } from "../../editor/editor-instance-store";
import { ConductStore } from "../../conduct/conduct-store";


export type CurrentTabObjDual = [TabObj | null, TabObj | null, TabObj | null];

export const useTabObjFinder = () => {
  const dispatch = useDispatch();

  const playStatus = useSelector((state: RootState) => state.playStatus);

  const toggleFollowEditorLineWhenPlaying = useSelector((state: RootState) => state.statusOfSettings.followEditorLineWhenPlaying);
  // const syntaxVersions = useSelector((state: RootState) => state.syntaxVersion);
  const versionMatched = useSelector((state: RootState) => state.syntaxMatchVersion.matched);
  const conduct = ConductStore.getPlayObj()

  // 差分確認用
  const curDualToIndex = useRef([-1, -1, -1]);
  const dualTabObj = useRef<CurrentTabObjDual>([null, null, null]);
  const curRegionIndex = useRef<number>(-1);
  const maxViewLine = useRef<number>(0);
  // const dualSymEndTicks = useRef<[number, number, number]>([-1, -1, -1]);

  const CurrentTabObjDual = () => {
    return dualTabObj.current;
  }

  useSubscribe<number>(
    (state: RootState) => state.playTick.seekTick,
    (curTick: number) => {

      if (
        !conduct
        // || playStatus.status !== 1 // 再生時のみ
        // || curTick === totalTick // 末端からresetSeekしてもシンセが一度末端のTickを出力してしまう対応
      ) return;

      for (let dualId = 0; dualId < conduct.mixesList.length; dualId++) {
        const { to, index } = findStartTabObj(conduct.mixesList[dualId].flatTOList, curTick);

        if (to) {

          // 差分発生時のみstore更新
          if (index !== curDualToIndex.current[dualId]) {

            curDualToIndex.current[dualId] = index; // 差分確認値更新

            // dual毎のTabObj内部保持
            dualTabObj.current[dualId] = to;

            const stepInfoId = to.extendInfo?.stepInfoId;
            let stepInfo = null;
            if (stepInfoId) {
              stepInfo = {
                orderIndex: stepInfoId.orderCount,
                info: conduct.extensionInfo.stepInfoList[stepInfoId.id]
              }
            }

            // editorに対するフォーカスを検知してスクロールのみ停止制御する
            if (
              toggleFollowEditorLineWhenPlaying &&
              versionMatched
            ) {

              // play sym jump
              if (
                (
                  maxViewLine.current < to.syntaxLocation.line
                  || curRegionIndex.current !== to.regionIndex
                )
                && !EditorInstanceStore.getEditor().editor.hasTextFocus()
                // && toggleFollowEditorLineWhenPlaying
              ) {
                EditorControl.jumpToLine(to.syntaxLocation.line);
                maxViewLine.current = to.syntaxLocation.line;
              }

              // play sym decoration
              if (to.locationIndexes) {
                EditorControl.clearPlaySymDecoration(dualId);
                // console.log('locationIndexes to>>', to)

                const loc = conduct.locationInfoList[to.locationIndexes[0]];
                EditorControl.setPlaySymDecoration(dualId, { // locなのでnoteのみ
                  startLineNumber: loc.line,
                  startColumn: loc.linePos,
                  endLineNumber: loc.endLine,
                  endColumn: loc.endPos
                }, 'decoration-playSym-back');
                
                if (to.isArpeggio) { 
                  EditorControl.setPlaySymDecoration(dualId, { // 全体だが、stepの場合 stepSym のみ
                    startLineNumber: to.syntaxLocation.line,
                    startColumn: to.syntaxLocation.linePos,
                    endLineNumber: to.syntaxLocation.endLine,
                    endColumn: to.syntaxLocation.endPos
                  });
                  // console.log('to.isBullet>>', to)
                } else if (to.isBullet) {
                  EditorControl.setPlaySymDecoration(dualId, { // 全体だが、stepの場合 stepSym のみ
                    startLineNumber: to.syntaxLocation.line,
                    startColumn: to.syntaxLocation.linePos,
                    endLineNumber: to.syntaxLocation.endLine, // 20241114 おかしいので暫定対応
                    endColumn: to.syntaxLocation.endPos
                  });
                  // console.log('to.isBullet>>', to)
                }

              }
            } else {
              EditorControl.clearPlaySymDecoration(dualId);
            }

            // store region
            if (curRegionIndex.current !== to.regionIndex) {
              curRegionIndex.current = to.regionIndex;
              dispatch(updatePlayRegion(conduct.mixesList[dualId].regionList[to.regionIndex]));
            }

            dispatch(updateSymArrObj(
              {
                index: dualId,
                value: {
                  id: to.tabObjId,
                  tick: to.bar,
                  note: to.note,
                  noteStr: to.noteStr,
                  tab: to.tab || [],
                  trueTab: to.trueTab || [],
                  activeTab: to.activeBows || [],
                  velocity: to.velocity || [],
                  shifted: to.shifted ? to.shifted.map(s => s.shift) : [], 
                  stepInfo: stepInfo,
                  location: { line: to.syntaxLocation.line, linePos: to.syntaxLocation.linePos },
                  region: conduct.mixesList[dualId].regionList[to.regionIndex],
                  style: to.styles
                }
              }
            ));

            // if (dualId === 0) {
            dispatch(updatePlayBPM(to.bpm));
            // }
 
          }
 
        } else if (dualTabObj.current[dualId]) {

          const stopTick = dualTabObj.current[dualId]?.bar.stopTick;
          if (stopTick !== undefined && stopTick < curTick) {
            // 消す確認
            dualTabObj.current[dualId] = null;
            dispatch(updateSymArrObj(
              {
                index: dualId,
                value: null
              }
            ));
            EditorControl.clearPlaySymDecoration(dualId);
          }  
        }

      }
    }
  );

  useEffect(() => {
    maxViewLine.current = 0;
    if (versionMatched) {
      // for (let dualId = 0; dualId < conduct.mixesList.length; dualId++) {
      EditorControl.clearAllPlaySymDecoration();
    }
  }, [versionMatched])

  // play sym remove, and tracking syntax
  useEffect(() => {
    curDualToIndex.current = [-1, -1, -1];
    maxViewLine.current = 0;
    if (playStatus.status === 1) {
      if (conduct) {
        EditorControl.clearAllPlaySymDecoration();
      }
      [0, 1, 2].forEach((dualId) => {
        dispatch(updateSymArrObj(
          {
            index: dualId,
            value: null
          }
        ));
      })
    }
    return () => { }
  }, [
    playStatus.status,
    toggleFollowEditorLineWhenPlaying
  ]);

  return { CurrentTabObjDual }
}

/**
 * search only TabObj
 * @param to 
 * @param curTick 
 * @returns 
 */
function findStartTabObj(to: TabObj[], curTick: number) {
  let low = 0;
  let high = to.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (to[mid].bar.startTick <= curTick && curTick < to[mid].bar.stopTick) {
      // targetが範囲内にある場合
      return { to: to[mid], index: mid };
    } else if (to[mid].bar.startTick > curTick) {
      //   // targetがstartより小さい場合、この区間を候補として保持し、さらに左側を探索
      //   bestMatch = to[mid]; // これがtargetより大きい最小のstartを持つ区間になる
      //   high = mid - 1;
      high = mid - 1;
    } else {
      // targetがendより大きい場合、右側を探索
      low = mid + 1;
    }
  }

  // 範囲内に含まれる区間がなく、target未満のstartを持つ最初の区間を返す
  return { to: null, index: -1 };
}