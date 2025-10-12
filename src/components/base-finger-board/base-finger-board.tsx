import React, { useEffect } from "react";
// import { IScale } from "../../store/cur-location-view/slice-cl-scale";
import { IKey } from "axentax-compiler";
import styles from './base-finger-board.module.scss';
import { createFullBoardKeyList, targetFretLoc } from "./board-utils";

/* eslint-disable react-refresh/only-export-components */
export enum ShowBoardKey {
  None,
  Scale,
  Full
}
/* eslint-enable react-refresh/only-export-components */

interface Props {
  svgRefLeft: React.RefObject<SVGSVGElement>,
  svgRefRight: React.RefObject<SVGSVGElement>,
  fretBoardRef: React.RefObject<HTMLDivElement>,
  tuning: IKey[] | undefined,
  // scale: IScale,
  showBoardKey: ShowBoardKey,
  scrollIdPrefix: string,
  handleOnClickFretKeys?: (stringIndex: number, fret: number) => void,
  handleOnClickStrings?: (stringIndex: number) => void,
}
export const BaseFingerBoard: React.FC<Props> = React.memo((props: Props) => {

  const tuningLen = props.tuning?.length || 6;
  const tuning = [...props.tuning || ['E', 'A', 'D', 'G', 'B', 'E']].reverse();

  // handle click left
  useEffect(() => {

    //
    // on click left
    //
    const handleLeftSvgClick = (event: MouseEvent) => {

      const targetGroup = (event.target as Element).closest('g');
      if (!targetGroup) return;
      const targetId = targetGroup.id;

      if (props.handleOnClickStrings && /stringNumber=/.test(targetId)) {
        const matched = targetId.match(/=(\d)/);
        if (matched) {
          // console.log('[left.string(index)]:', matched[1]);
          props.handleOnClickStrings(parseInt(matched[1]));
        }
      } else if (props.handleOnClickFretKeys && /fretKey=/.test(targetId)) {
        const matched = targetId.match(/=(\d)/);
        if (matched) {
          // console.log('[left.fret(index)]:', matched[1]);
          props.handleOnClickFretKeys(parseInt(matched[1]), 0);
        }
      }
    };
    const svgLeftElement = props.svgRefLeft.current;
    if (svgLeftElement) {
      svgLeftElement.addEventListener('click', handleLeftSvgClick);
    }

    //
    // on click right
    //
    const handleRightSvgClick = (event: MouseEvent) => {

      const targetGroup = (event.target as Element).closest('g');
      if (!targetGroup) return;
      const targetId = targetGroup.id;

      if (props.handleOnClickFretKeys && /fretKey=/.test(targetId)) {
        const matched = targetId.match(/=(\d+)_(\d)/);
        if (matched) {
          // console.log('[right.fret(index)]:', matched[1], matched[2]);
          props.handleOnClickFretKeys(parseInt(matched[2]), parseInt(matched[1]) + 1);
        }
      }
    };
    const svgRightElement = props.svgRefRight.current;
    if (svgRightElement) {
      svgRightElement.addEventListener('click', handleRightSvgClick);
    }

    return () => {
      if (svgLeftElement) {
        svgLeftElement.removeEventListener('click', handleLeftSvgClick);
      }
      if (svgRightElement) {
        svgRightElement.removeEventListener('click', handleRightSvgClick);
      }
    };
  }, []);

  const headPadding = 10;
  const boardRight = 950;

  // strings
  const everyStringAllHeight = [140, 136, 133, 131]; // 6, 7, 8, 9
  const everyStringHeight = (everyStringAllHeight[tuningLen - 6] / tuningLen);
  // strings
  const strings: { sym: string, loc: number }[] = []
  for (let i = 0; i < tuningLen; i++) {
    const stringY = headPadding + i * everyStringHeight;
    strings.push({ sym: tuning[i], loc: stringY });
  }

  // frets right
  const fretWidth = 50;
  const frets: { line: number, loc: number }[] = [];
  let xx = 0;
  for (let i = 0; i < 25; i++) {
    const w = i ? fretWidth - (i > 12 ? i : (i / 2)) : 0;
    const wNext = (fretWidth - ((i + 1) > 12 ? (i / 2 + 8) : ((i + 1) / 2))) / 2;
    xx += w;
    frets.push({ line: xx, loc: xx + wNext })
  }

  // fret keys right
  const fretKeysRightSVG = () => {
    return (<>
      {
        createFullBoardKeyList(tuning).map((row, yi) => row.map((x, xi) => {
          return (
            <React.Fragment key={'' + yi + xi}>
              <g
                id={props.scrollIdPrefix + '_fretKey=' + xi + '_' + yi}
                className={`${x.replace(/#/, 's')} ${styles.fretKeyColorRight}`}
                style={{ opacity: '0.2' }}
                data-key={props.scrollIdPrefix + '_fretKey=' + xi + '_' + yi}>
                <rect
                  x={targetFretLoc[xi] - 13}
                  y={strings[yi].loc + - 10}
                  width="26"
                  height="22" fill="red" stroke="none" fillOpacity="0" />
                <text
                  x={targetFretLoc[xi]}
                  y={strings[yi].loc + 2}
                  fontFamily="self"
                  fontWeight="normal"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  // color="#aaa"
                  fontSize={14}
                >{x}</text>
              </g>
            </React.Fragment>
          )
        })
        )
      }
    </>);
  }

  // svg left
  const baseBoardLeft = (
    <>
      <rect x="0" y="0" width="100%" height="138" fill="#111111" />
      {
        tuning.map((key, i) => {
          const stringY = headPadding + i * everyStringHeight;
          return (
            <React.Fragment key={i}>
              <line x1="20" y1={stringY} x2={boardRight} y2={stringY} stroke="#777" />
              <g
                id={props.scrollIdPrefix + '_stringNumber=' + i}
                className={`stringKey ` + (props.handleOnClickStrings ? styles.stringNumberColorLeft : '')}>
                <rect
                  x={0}
                  y={stringY + 2 + - 9}
                  width="20"
                  height="14" fill="red" stroke="none" fillOpacity="0" />
                <text
                  x="5"
                  y={stringY + 5}
                  fontFamily="Arial"
                  fontWeight="bold"
                  fontSize={14}
                >{i + 1}</text>
              </g>

              <g
                id={props.scrollIdPrefix + '_fretKey=' + i}
                className={`stringKey ${key.replace(/#/, 's')} ` + (props.handleOnClickFretKeys ? styles.fretKeyColorLeft : '')}
                style={{ opacity: props.showBoardKey !== ShowBoardKey.None ? '0.2' : '1' }}>
                <rect
                  x={30 - 7}
                  y={stringY + 2 + - 9}
                  width="26"
                  height="16" fill="red" stroke="none" fillOpacity="0" />
                <text
                  x="30"
                  y={stringY + 2}
                  fontFamily="Arial"
                  fontSize={14}
                  dominantBaseline="middle"
                >{key}</text>
              </g>
            </React.Fragment>
          )
        })
      }
    </>
  );

  // svg right
  const baseBoardRight = (<>
    {/* Board background */}
    <rect x="0" y="0" width={boardRight} height="138" fill="#333333" />
    {/* Fret Marks */}
    <circle cx={targetFretLoc[2]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[4]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[6]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[8]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[11]} cy="34" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[11]} cy="104" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[14]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[16]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[18]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[20]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    <circle cx={targetFretLoc[22]} cy="69" r="6" textAnchor="middle" fill="#636363" />
    {/* Frets line */}
    {
      frets.map((fret, i) => {
        return (
          <React.Fragment key={i}>
            {i < 24 ? <text
              x={targetFretLoc[i]}
              y="155"
              fontFamily="Arial"
              fontWeight="bold"
              textAnchor="middle"
              fontSize={14}
              fill="#aaa"
            >{i + 1}</text> : <></>}
            <line id={props.scrollIdPrefix + '_scroll_' + (i + 1)} x1={fret.line} y1={headPadding - 10} x2={fret.line} y2={headPadding + 127} stroke="#999" />
            <line x1={fret.line + 1} y1={headPadding - 10} x2={fret.line + 1} y2={headPadding + 127} stroke="#BBB" />
            <line x1={fret.line + 2} y1={headPadding - 10} x2={fret.line + 2} y2={headPadding + 127} stroke="#CCC" />
            <line x1={fret.line + 3} y1={headPadding - 10} x2={fret.line + 3} y2={headPadding + 127} stroke="#BBB" />
          </React.Fragment>
        )
      })
    }
    {/* Strings line */}
    {
      strings.map((string, i) => {
        return (
          <React.Fragment key={i}>
            <line x1="0" y1={string.loc} x2={boardRight} y2={string.loc} stroke="#777" />
          </React.Fragment>
        )
      })
    }
  </>)

  // pointer left
  const pointersLeft =
    strings.map((_string, i) => {
      return (
        <React.Fragment key={i}>
          <circle
            className={'pointerL' + i}
            style={{ display: 'none' }}
            cx={35}
            cy={strings[i].loc}
            r="6"
            textAnchor="middle"
            stroke="white"
            strokeWidth="2"
            fill="#1d8cd1"
          />
        </React.Fragment>
      )
    });

  // shadow pointer left
  const shadowsLeft =
    strings.map((_string, i) => {
      return (
        <React.Fragment key={i}>
          <circle
            className={'shadowL' + i}
            style={{
              opacity: '0.4',
              display: 'none'
            }}
            cx={35}
            cy={strings[i].loc}
            r="6"
            textAnchor="middle"
            stroke="white"
            strokeWidth="2"
            fill="#59d11d"
          />
        </React.Fragment>
      )
    });

  // pointer right
  const pointersRight =
    strings.map((_string, i) => {
      return (
        <React.Fragment key={i}>
          <circle
            className={'pointerR' + i}
            style={{
              transition: 'cx 0.03s ease',
              display: 'none'
            }}
            cx={targetFretLoc[0]}
            cy={strings[i].loc}
            r="6"
            textAnchor="middle"
            stroke="white"
            strokeWidth="2"
            fill="#1d8cd1"
          />
        </React.Fragment>
      )
    });

  // shadow pointer right
  const shadowsRight =
    strings.map((_string, i) => {
      return (
        <React.Fragment key={i}>
          <circle
            className={'shadowR' + i}
            style={{
              transition: 'cx 0.03s ease',
              opacity: '0.4',
              display: 'none'
            }}
            cx={targetFretLoc[2]}
            cy={strings[i].loc}
            r="6"
            textAnchor="middle"
            stroke="white"
            strokeWidth="2"
            fill="#59d11d"
          />
        </React.Fragment>
      )
    });

  // todo: SVG自体をキャッシュ化して、キャッシュしたSVG自体を取り込む
  //       https://chatgpt.com/share/67223e53-d898-800d-9325-12b4fe285192
  //       SVGの中でキャッシュしたSVGを書くだけ。多分。

  return (
    <>
      <div className={`${styles.contents} unSelectable`}>
        <div className={styles.flex}>
          <div className={styles.fretHeader}>
            <svg ref={props.svgRefLeft} width="55" height={155}>
              {baseBoardLeft}
              {shadowsLeft}
              {pointersLeft}
            </svg>
          </div>
          <div ref={props.fretBoardRef} className={`${styles.fretBoard} ${styles.hideScrollbar}`}>
            <svg ref={props.svgRefRight} width="950" height={155}>
              {baseBoardRight}
              {props.showBoardKey !== ShowBoardKey.None ? fretKeysRightSVG() : null}
              {shadowsRight}
              {pointersRight}
            </svg>
          </div>
        </div>
      </div>
      {/* {Math.random()} */}
    </>
  );

});
