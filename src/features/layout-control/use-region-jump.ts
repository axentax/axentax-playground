import store from "../../store/store"
import { EditorControl } from "../../editor/editor-control";
import { XSynth } from "../../synth/x-synth";
import { global } from "../../settings";
import { SysSettings } from "axentax-compiler";
import { ConductStore } from "../../conduct/conduct-store";

export const useRegionJumpByControl = () => {

  /** prev */
  function prev() {

    const conduct = ConductStore.getPlayObj();
    if (!conduct) return;

    const playingRegion = store.getState().playRegion.region;
    if (!playingRegion) return;
    
    const playTick = store.getState().playTick.seekTick;
    
    const baseRegion = conduct.mixesList[0].regionList[playingRegion.id];

    const widthActiveRegionList = conduct.mixesList[0].regionList.filter(f => {
      return f.startLayerTick !== f.endLayerTick
    });

    let targetLine = 0;
    let targetRegionId = 0;
    for (let ei = widthActiveRegionList.length - 1; ei >= 0; ei--) {
      const region = widthActiveRegionList[ei];
      if (region.start.line < baseRegion.start.line && playTick > region.startLayerTick) {
        targetLine = region.start.line
        targetRegionId = region.id;
        break;
      }
    }
    if (targetLine === 0) return;

    let targetTick = -1;

    parent: for (let dualId = 0; dualId < global.dualLength; dualId++) {
      const toList = conduct.mixesList[dualId].flatTOList;
      for (let ti = 0; ti < toList.length; ti++) {
        const to = toList[ti];
        if (targetRegionId === to.regionIndex) { // && to.syntaxLocation.line >= targetLine) {
          targetTick = to.bar.startTick;
          EditorControl.jumpToLine(targetLine);
          XSynth.getInstance().setSeek(targetTick);
          break parent;
        }
      }
    }
  }

  /** next */
  function next() {
    // const conduct = ccp.getConductCurPlaying();
    const conduct = ConductStore.getPlayObj();
    if (!conduct) return;

    // \region.startLayerTick <= currentTick の条件で絶対マッチしないため
    // currentTick < 480 の場合は 480に設定
    let currentTick = store.getState().playTick.seekTick;
    if (currentTick <  SysSettings.startTick) {
      currentTick = SysSettings.startTick;
    }
    
    const regionList = conduct.mixesList[0].regionList;

    let targetTick = 0;
    let targetLine = 0;
    for (let ri = regionList.length - 1; ri >= 0; ri--) {
      const region = regionList[ri];
      if (region.startLayerTick <= currentTick) {
        if (ri < regionList.length - 1) {
          targetTick = regionList[ri + 1].startLayerTick;
          targetLine = regionList[ri + 1].start.line;
        }
        break;
      }
    }
    if (targetTick) {
      EditorControl.jumpToLine(targetLine);
      XSynth.getInstance().setSeek(targetTick);
    }
  }

  return {
    jumpToPrevRegion: () => prev(),
    jumpToNextRegion: () => next()
  }
}
