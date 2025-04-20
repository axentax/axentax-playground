import { useCallback, useRef } from "react";
import { targetFretLoc } from "./board-utils";
import { IKey } from "axentax-compiler";
import { v4 as uuid } from 'uuid';

export interface FingerBoardControl {
  /** 弦インデックス。1限の場合0 */
  stringIndex: number,
  /** フレット番号 undefinedの場合は非表示 */
  fret?: number,
  /** フレット番号 鳴続けているフレット これが設定されている場合、上記fretは無効?? */
  echo?: number,
  /** シフト前音がある場合はフレット設定。fretと同じ値の場合、こちらの表示は隠れる、指定がない場合shadow削除 */
  shadow?: number
}

// let fingerBoardControllerInstance: ReturnType<typeof useFingerBoardController> | null = null;

// シングルトンフック ※未使用
// export const useSingletonFingerBoardController = () => {
//   if (!fingerBoardControllerInstance) {
//     fingerBoardControllerInstance = useFingerBoardController();
//   }
//   return fingerBoardControllerInstance;
// };

export const useFingerBoardController = () => {

  // const [tuning, setTuning] = useState<IKey[] | undefined>(undefined)
  // const tuningSetter = (tuning: IKey[] | undefined) => {
  //   setTuning(tuning)
  // }

  const svgRefLeft = useRef<SVGSVGElement>(null);
  const svgRefRight = useRef<SVGSVGElement>(null);
  const fretBoardRef = useRef<HTMLDivElement>(null);

  const scrollIdPrefix = useRef(uuid());

  // todo: useCallback
  // const _scrollElm = useCallback((fret: number) => fretBoardRef.current?.querySelector('scroll' + fret), []);
  const _leftPointerElm = useCallback((stringIndex: number) => svgRefLeft.current?.querySelector('.pointerL' + stringIndex), []);
  const _leftShadowElm = useCallback((stringIndex: number) => svgRefLeft.current?.querySelector('.shadowL' + stringIndex), []);
  const _rightPointerElm = useCallback((stringIndex: number) => svgRefRight.current?.querySelector('.pointerR' + stringIndex), []);
  const _rightShadowElm = useCallback((stringIndex: number) => svgRefRight.current?.querySelector('.shadowR' + stringIndex), []);

  const _hideLeftPointer = useCallback((stringIndex: number) => {
    const p = _leftPointerElm(stringIndex);
    if (p) (p as HTMLElement).style.display = 'none';
  }, []);
  const _hideLeftShadow = useCallback((stringIndex: number) => {
    const p = _leftShadowElm(stringIndex);
    if (p) (p as HTMLElement).style.display = 'none';
  }, []);
  const _hideRightPointer = useCallback((stringIndex: number) => {
    const p = _rightPointerElm(stringIndex);
    if (p) (p as HTMLElement).style.display = 'none';
  }, []);
  const _hideRightShadow = useCallback((stringIndex: number) => {
    const p = _rightShadowElm(stringIndex);
    if (p) (p as HTMLElement).style.display = 'none';
  }, []);

  const _setPointer = useCallback((stringIndex: number, fret: number, stroke = true) => {
    if (fret === 0) {
      _hideRightPointer(stringIndex);
      const pl = _leftPointerElm(stringIndex);
      if (pl) {
        (pl as HTMLElement).style.display = 'block';
        pl.setAttribute('stroke-width', stroke ? '2' : '0');
      }
    } else {
      _hideLeftPointer(stringIndex);
      const pr = _rightPointerElm(stringIndex);
      if (pr && targetFretLoc[fret - 1] !== undefined) {
        (pr as HTMLElement).style.display = 'block';
        pr.setAttribute('cx', targetFretLoc[fret - 1].toString());
        pr.setAttribute('stroke-width', stroke ? '2' : '0');
      }
    }
  }, []);

  const _setShadow = useCallback((stringIndex: number, fret: number) => {
    if (fret === 0) {
      _hideRightShadow(stringIndex);
      const pl = _leftShadowElm(stringIndex);
      if (pl) {
        (pl as HTMLElement).style.display = 'block';
      }
    } else {
      _hideLeftShadow(stringIndex);
      const pr = _rightShadowElm(stringIndex);
      if (pr && targetFretLoc[fret - 1] !== undefined) {
        // console.log("targetFretLoc",targetFretLoc);
        (pr as HTMLElement).style.display = 'block';
        pr.setAttribute('cx', targetFretLoc[fret - 1].toString());
      }
    }
  }, []);

  /**
   * finger board のpointerをコントロール
   * 指定しない弦がある場合は何もしないため前回の状態になる
   * @param fbcList FingerBoardControlの配列を指定
   */
  const setFingers = useCallback((fbcList: FingerBoardControl[]) => {
    // console.log("fbcList>>", fbcList)

    let existFret = false;
    let scrollTargetFret = 25;
    const updateScrollTarget = (fret: number) => {
      if (scrollTargetFret > fret && fret > 0) {
        scrollTargetFret = fret;
        existFret = true;
      }
    }

    // each strings
    fbcList.forEach(fbc => {

      // tab
      if (fbc.fret !== undefined) {
        _setPointer(fbc.stringIndex, fbc.fret);
        updateScrollTarget(fbc.fret);
      } else {
        _hideLeftPointer(fbc.stringIndex)
        _hideRightPointer(fbc.stringIndex)
      }

      // activeTab
      if (fbc.echo !== undefined) {
        _setPointer(fbc.stringIndex, fbc.echo, false)
        // updateScrollTarget(fbc.echo);
      }

      // shadow
      if (fbc.shadow !== undefined) {
        _setShadow(fbc.stringIndex, fbc.shadow);
        // updateScrollTarget(fbc.shadow);
      } else {
        _hideLeftShadow(fbc.stringIndex)
        _hideRightShadow(fbc.stringIndex)
      }
    });

    // scroll
    if (existFret) {
      const svgElement = document.getElementById(scrollIdPrefix.current + '_scroll_' + scrollTargetFret);
      if (svgElement && fretBoardRef.current) {
        const container = fretBoardRef.current;
        const containerRect = container.getBoundingClientRect();
        const elementRect = svgElement.getBoundingClientRect();
        // const scrollLeft = elementRect.left - containerRect.left + container.scrollLeft - (containerRect.width) + (elementRect.width);
        const scrollLeft = elementRect.left - containerRect.left + container.scrollLeft;
        container.scrollTo({
          left: scrollLeft,
          // behavior: 'smooth'
        });
      }
    }

  }, []);

  /**
   * スケール音のみのフレットキーを表示状態に変更
   * @param scaleBinList E minor の場合は [1,0,1,0,1,0,1,1,0,1,0,1] となるリスト
   */
  const fretKeyScaleChange = (scaleBinList: (0 | 1)[]) => {
    const existBin = scaleBinList.includes(1);
    (['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'] as IKey[]).forEach((key, i) => {
      const elmsLeft = svgRefLeft.current?.querySelectorAll('.' + key);
      const elmsRight = svgRefRight.current?.querySelectorAll('.' + key);
      if (scaleBinList[i] && existBin) {
        elmsLeft?.forEach(elm => (elm as HTMLElement).style.opacity = '1');
        elmsRight?.forEach(elm => (elm as HTMLElement).style.opacity = '1');
      } else {
        elmsLeft?.forEach(elm => (elm as HTMLElement).style.opacity = '0.2');
        elmsRight?.forEach(elm => (elm as HTMLElement).style.opacity = '0.2');
      }
    })
  }

  return {
    svgRefLeft,
    svgRefRight,
    fretBoardRef,
    setFingers,
    fretKeyScaleChange,
    // tuningDetect: tuning,
    // tuningSetter
    scrollIdPrefix: scrollIdPrefix.current,
  };
}
