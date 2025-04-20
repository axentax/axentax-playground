import { useCallback, useRef } from "react";
import { v4 as uuid } from 'uuid';

export interface FingerBoardMiniControl {
  /** 弦インデックス。1限の場合0 */
  stringIndex: number,
  /** フレット番号 undefinedの場合は非表示 */
  fret?: number,
  /** フレット番号 鳴続けているフレット これが設定されている場合、上記fretは無効?? */
  echo?: number,
  /** シフト前音がある場合はフレット設定。fretと同じ値の場合、こちらの表示は隠れる、指定がない場合shadow削除 */
  shadow?: number
}

export const useFingerBoardMiniController = () => {

  const targetFretLocation = useRef<number[] | null>(null);

  const svgRefRight = useRef<SVGSVGElement>(null);

  const scrollIdPrefix = useRef(uuid());

  const setFretLocation = (locs: number[]) => {
    targetFretLocation.current = locs;
  }

  const _rightPointerElm = useCallback((stringIndex: number) => svgRefRight.current?.querySelector('.pointerR' + stringIndex), []);
  const _rightShadowElm = useCallback((stringIndex: number) => svgRefRight.current?.querySelector('.shadowR' + stringIndex), []);

  const _hideRightPointer = useCallback((stringIndex: number) => {
    const p = _rightPointerElm(stringIndex);
    if (p) (p as HTMLElement).style.display = 'none';
  }, []);
  const _hideRightShadow = useCallback((stringIndex: number) => {
    const p = _rightShadowElm(stringIndex);
    if (p) (p as HTMLElement).style.display = 'none';
  }, []);

  const _setPointer = useCallback((stringIndex: number, fret: number, stroke = true) => {

    if (!targetFretLocation.current) return;

    const pr = _rightPointerElm(stringIndex);
    if (pr && targetFretLocation.current[fret] !== undefined) {
      (pr as HTMLElement).style.display = 'block';
      pr.setAttribute('cx', targetFretLocation.current[fret].toString());
      pr.setAttribute('stroke-width', stroke ? '2' : '0');
    }
    // }
  }, []);

  const _setShadow = useCallback((stringIndex: number, fret: number) => {

    if (!targetFretLocation.current) return;

    const pr = _rightShadowElm(stringIndex);
    if (pr && targetFretLocation.current[fret] !== undefined) {
      (pr as HTMLElement).style.display = 'block';
      pr.setAttribute('cx', targetFretLocation.current[fret].toString());
    }
  }, []);

  /**
   * finger board のpointerをコントロール
   * 指定しない弦がある場合は何もしないため前回の状態になる
   * @param fbcList FingerBoardControlの配列を指定
   */
  const setFingers = useCallback((fbcList: FingerBoardMiniControl[]) => {

    // each strings
    fbcList.forEach(fbc => {

      // tab
      if (fbc.fret !== undefined) {
        _setPointer(fbc.stringIndex, fbc.fret);
      } else {
        _hideRightPointer(fbc.stringIndex)
      }

      // activeTab
      if (fbc.echo !== undefined) {
        _setPointer(fbc.stringIndex, fbc.echo, false)
      }

      // shadow
      if (fbc.shadow !== undefined) {
        _setShadow(fbc.stringIndex, fbc.shadow);
      } else {
        _hideRightShadow(fbc.stringIndex)
      }
    });

  }, []);

  return {
    svgRefRight,
    setFingers,
    scrollIdPrefix: scrollIdPrefix.current,
    setFretLocation
  };
}
