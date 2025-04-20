import { Conduct, CSymbolType, ScaleNameKeys, Styles, TabObj, XUtils } from "axentax-compiler";
import { CursorLocation } from "../store/slice-cursor-location";
import { BraceLocationInfo, LocationInfo } from "axentax-compiler";
import { IScale } from "../store/cur-location-view/slice-cl-scale";
import { CLView } from "./use-refresh-location";

export class RefreshLocationService {

  static getScaleFromBraceStyles(conduct: Conduct, braceStyles: Styles): IScale {
    const scaleX = braceStyles.scaleX || conduct.settings.style.scale;
    return {
      isValid: true,
      name: ScaleNameKeys[scaleX.scale],
      key: scaleX.key,
      bin: scaleX.bin
    }
  }

  /**
   * util: TabObjからスケール取得（ない場合は設定から取得）
   * @param conduct 
   * @param to 
   */
  static getScaleFromTabObj(conduct: Conduct, clView: CLView, to: TabObj | null, braceStyles: Styles | null) {
    const scaleX = to?.styles.scaleX || braceStyles?.scaleX || conduct.settings.style.scale;
    clView.scale = {
      isValid: true,
      name: ScaleNameKeys[scaleX.scale],
      key: scaleX.key,
      bin: scaleX.bin
    }
  }

  /**
   * util: LocationInfoを元にtypeがスケールのLocationInfoのsymをキーとした styleObjectBank の Styles取得
   * @param conduct 
   * @param loInfo 
   */
  static getStyleFromStyleObjectBank(conduct: Conduct, loInfo: LocationInfo) {
    if (loInfo.type === CSymbolType.style || loInfo.type === CSymbolType.blockStyle) {
      const shortStr = XUtils.innerTrimerForStyleKey(loInfo.sym);
      // stepのみ位置情報必要
      let stepKeyTail = '';
      if (/^step/.test(loInfo.sym)) {
        stepKeyTail = ':' + loInfo.line + ':' + loInfo.linePos;
      }
      // region
      const region = conduct.mixesList[loInfo.dualId].regionList[loInfo.regionId];
      // ke
      const cacheKey = `${region.tuning.toString()}_${shortStr}` + stepKeyTail;

      // search
      const style = structuredClone(conduct.styleObjectBank[cacheKey]);
      if (!style) {
        console.error('==>> [A]styleObjectBankから見つからないstyle:' + cacheKey, loInfo.sym);
      }
      return style;
    }
    return {} as Styles;
  }


  /**
   * locationInfoListからcursorに一致するlocationInfo検索
   * @param conduct 
   * @param cursor 
   * @returns インデックス
   */
  static searchLocationInfo(conduct: Conduct, cursor: CursorLocation) {
    // locationInfoListから note等の主要symbol 検索
    const locationInfoListLength = conduct.locationInfoList.length;
    // 位置が重複する場合、後方のsymを優先するため逆ループで検索 例: {A}:step(1)B
    for (let li = locationInfoListLength - 1; li >= 0; li--) {
      const locationInfo = conduct.locationInfoList[li];

      if (cursor.line < locationInfo.line || locationInfo.endLine < cursor.line) {
        continue;
      }
      // カーソルと行一致
      if (locationInfo.line === locationInfo.endLine) {
        // 単数行のlocationInfoに一致
        if (locationInfo.linePos <= cursor.column && cursor.column <= locationInfo.endPos) {
          return li;
        }
      } else {
        // 複数行のlocationInfoに一致
        if (locationInfo.line === cursor.line && locationInfo.linePos <= cursor.column
          || locationInfo.endLine === cursor.line && cursor.column <= locationInfo.endPos
          || locationInfo.line < cursor.line && cursor.line < locationInfo.endLine
        ) {
          return li;
        }
      }
    }

    return null;
  }

  /**
   * blockStyleを階層解決して返却
   * @param conduct 
   * @param cursor 
   * @returns 
   */
  static getBraceStyles(conduct: Conduct, clView: CLView, cursor: CursorLocation): Styles | null {

    // (callback)親ブロックを遡りつつ、最終的に適用されるbraceStyleの一覧を構築
    const traverseParentBrackets = (loInfo: BraceLocationInfo) => {
      let res: Styles = {};
      const upperBlockLoInfoIds = [loInfo.id, ...loInfo.upperBlock];
      // 親階層を順に確認
      for (let ui = upperBlockLoInfoIds.length - 1; ui >= 0; ui--) {
        if (conduct.braceLocationInfoList[upperBlockLoInfoIds[ui]].styles.length) {
          const upperLoInfo = conduct.braceLocationInfoList[upperBlockLoInfoIds[ui]];
          for (let si = upperLoInfo.styles.length - 1; si >= 0; si--) {
            const style = this.getStyleObjectForBraceFromLoInfo(conduct, si, conduct.braceLocationInfoList[upperBlockLoInfoIds[ui]])
            // console.log('!ups!', style)
            if (style.mapped) {
              if (!res.mapped) {
                res = { ...res, ...style }  
              } else {
                res.mapped.unshift(style.mapped![0])
              }
            } else {
              res = { ...res, ...style }
            }
          }

        }
      }

      return res;
    };

    // braceLocationInfoListから検索
    const braceLocationInfoListLength = conduct.braceLocationInfoList.length;
    // 内側からマッチさせるため逆ループ
    for (let bi = braceLocationInfoListLength - 1; bi >= 0; bi--) {
      const loInfo = conduct.braceLocationInfoList[bi];
      if (cursor.line < loInfo.line || loInfo.endLine < cursor.line) {
        continue;
      }
      // カーソルと行一致
      if (loInfo.line === loInfo.endLine) {
        // 単数行
        if (loInfo.linePos < cursor.column && cursor.column < loInfo.endPos) {
          // 親ブロックを遡りつつ、braceStyleの一覧を構築
          const traversed = traverseParentBrackets(loInfo);
          clView.braceStyles = { styles: traversed }
          return traversed;
          // return null
        }
      } else {
        // 複数行
        if (loInfo.line === cursor.line && loInfo.linePos < cursor.column
          || loInfo.endLine === cursor.line && cursor.column < loInfo.endPos
          || loInfo.line < cursor.line && cursor.line < loInfo.endLine
        ) {
          // 親ブロックを遡りつつ、braceStyleの一覧を構築
          const traversed = traverseParentBrackets(loInfo);
          clView.braceStyles = { styles: traversed }
          return traversed;
        }
      }
    }

    return null;
  }

  /**
   * styleObjectBankから文字列キーで検索 ※blockStyle専用
   * @param conduct 
   * @param styleStr 
   * @param regionId 
   * @param dualId 
   * @returns 
   */
  static getStyleObjectForBraceFromLoInfo(conduct: Conduct, si: number, loInfo: BraceLocationInfo): Styles {
    const readyKey = XUtils.innerTrimerForStyleKey(loInfo.styles[si]) + (
      /^step/.test(loInfo.styles[si]) ? `:${loInfo.linesOfStyle[si]}:${loInfo.linePosOfStyle[si]}` : ''
    );
    // region
    const region = conduct.mixesList[loInfo.dualId].regionList[loInfo.regionId];
    // key
    const cacheKey = `${region.tuning.toString()}_${readyKey}`;
    // search
    const style = structuredClone(conduct.styleObjectBank[cacheKey]);
    if (!style) {
      console.error('==>> [B]styleObjectBankから見つからない style: [' + cacheKey + ']');
    }
    return style;
  }

  /**
   * スタイルのマージ
   * @param accum 
   * @param styles 
   * @returns 
   */
  static mergeStyles(accum: Styles, styles: Styles): Styles {
    const _accum = accum; // broken
    Object.keys(styles).forEach(key => {
      const current = { key: styles[key as keyof Styles] } as Styles;
      if (/^map/.test(key) && _accum.mapped) {
        _accum.mapped.unshift(current.mapped![0])
        return { ..._accum };
      } else {
        return { // todo: Object.assign(_accum, current)
          ..._accum,
          ...current
        }
      }
    });

    return _accum;
  }

}