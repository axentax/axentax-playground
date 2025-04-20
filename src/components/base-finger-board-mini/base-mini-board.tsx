import { IKey } from "axentax-compiler";
import React from "react";
import { calculateFretPositions } from "./board-utils";

interface Props {
  svgRefRight: React.RefObject<SVGSVGElement>,
  tuning: IKey[] | undefined,
  showBoardKey: boolean,
  setFretLocation: (locs: number[]) => void
}
export const BaseFingerBoardMini: React.FC<Props> = (props: Props) => {

  const tuningLen = props.tuning?.length || 6;
  const tuning = [...props.tuning || ['E', 'A', 'D', 'G', 'B', 'E']].reverse();

  // const tuningLen = props.tuning?.length || 7;
  // const tuning = [...props.tuning || ['B', 'E', 'A', 'D', 'G', 'B', 'E']].reverse();

  // const tuningLen = props.tuning?.length || 8;
  // const tuning = [...props.tuning || ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E']].reverse();

  // const tuningLen = props.tuning?.length || 9;
  // const tuning = [...props.tuning || ['C#', 'F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E']].reverse();

  const _tmpFullX = 498.23; // [498.23, 642.03, 838.15] { 498.23 => 390, 642.03 => 500, 838.15 => 650 }
  // const _tmpFullX = 642.03; // [498.23, 642.03, 838.15] { 498.23 => 390, 642.03 => 500, 838.15 => 650 }
  const fullY = 85; // [75, 85]
  const fullXPadding = 2;
  const fontSize = 9;
  const fretMarkSize = fontSize * 0.7;

  const pointerSize = fullY / (tuningLen * 3);// fontSize * 0.5;

  const topFret = 24;
  const stringsRange = fullY / tuningLen;

  const fretStartX = fullXPadding + (fontSize * 4);

  const fretXs = calculateFretPositions(_tmpFullX - fretStartX, topFret);
  const fullX = fretStartX + fretXs[fretXs.length - 1] + (fretXs[fretXs.length - 1] - fretXs[fretXs.length - 2]);

  // frets #todo: 毎回変わらない処理は、シングルトンクラスに移動する
  const markXs = fretXs.map((x, i) => {
    return i === 0
      ? -((fretStartX - (fullXPadding + fontSize)) / 3)
      : x - (x - fretXs[i - 1]) / 2;
  });

  if (props.setFretLocation) props.setFretLocation(markXs.map(m => fretStartX + m));

  // strings
  const stringYs = tuning.map((_key, i) => {
    return (stringsRange / 2) + stringsRange * i;
  });

  return (
    <>
      <svg ref={props.svgRefRight} width={fullX} height={fullY}>

        {/* background */}
        <rect x={fretStartX} y="0" width={fullX - fretStartX} height={fullY} fill="#333333" />
        <rect x="0" y="0" width={fretStartX} height={fullY} fill="#000" />

        {/* ----- fret ----- */}
        {
          fretXs.map((x, i) => {
            return (
              <React.Fragment key={i}>
                <line x1={fretStartX + x - 1} y1={0} x2={fretStartX + x - 1} y2={fullY} stroke="#777" />
                <line x1={fretStartX + x} y1={0} x2={fretStartX + x} y2={fullY} stroke="#888" />
                <line x1={fretStartX + x + 1} y1={0} x2={fretStartX + x + 1} y2={fullY} stroke="#777" />
              </React.Fragment>
            )
          })
        }

        {/* fret mark */}
        {
          fretXs.map((_x, i) => {
            if (i === 3 || i === 5 || i === 7 || i === 10 || i === 15 || i === 17 || i === 19 || i === 21 || i === 23) {
              return (
                <React.Fragment key={i}>
                  <circle
                    // cx={fretStartX + fretMarkX}
                    cx={fretStartX + markXs[i]}
                    cy={fullY / 2}
                    r={fretMarkSize}
                    fill="#636363" />
                </React.Fragment>
              )
            } else if (i === 12) {
              return (
                <React.Fragment key={i}>
                  <circle
                    cx={fretStartX + markXs[i]}
                    cy={fullY / 4}
                    r={fretMarkSize}
                    fill="#636363" />
                  <circle
                    cx={fretStartX + markXs[i]}
                    cy={fullY - (fullY / 4)}
                    r={fretMarkSize}
                    fill="#636363" />
                </React.Fragment>
              )
            }
            return null
          }).filter(f => f !== null)
        }

        {/* ----- string ----- */}
        {
          tuning.map((key, i) => {
            return (
              <React.Fragment key={i}>
                {/* strings line */}
                <line x1={fullXPadding + fontSize * 2} y1={stringYs[i]} x2={fullX - fullXPadding} y2={stringYs[i]} stroke="#777" />
                {/* strings number */}
                <text
                  x={fullXPadding}
                  y={stringYs[i] + 1}
                  fontFamily="self"
                  fontWeight="normal"
                  textAnchor="top"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  style={{ fill: '#aaa' }}
                >{i + 1}</text>
                <text
                  x={fullXPadding + fontSize}
                  y={stringYs[i] + 1}
                  fontFamily="self"
                  fontWeight="normal"
                  textAnchor="top"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  style={{ fill: '#aaa' }}
                >{key}</text>
              </React.Fragment>
            )
          })
        }

        {/* ----- pointer ----- */}
        {
          tuning.map((_key, i) => {
            return (
              <React.Fragment key={i}>
                <circle
                  className={'shadowR' + i}
                  style={{
                    transition: 'cx 0.03s ease',
                    opacity: '0.4'
                    // display: 'none'
                  }}
                  cx={fretStartX + markXs[1]}
                  cy={stringYs[i]}
                  r={pointerSize}
                  textAnchor="middle"
                  stroke="white"
                  strokeWidth="1"
                  fill="#59d11d"
                />
                <circle
                  className={'pointerR' + i}
                  style={{
                    transition: 'cx 0.03s ease',
                    // display: 'none'
                  }}
                  cx={fretStartX + markXs[0]}
                  cy={stringYs[i]}
                  r={pointerSize}
                  textAnchor="middle"
                  stroke="white"
                  strokeWidth="1"
                  fill="#1d8cd1"
                />
              </React.Fragment>
            )
          })
        }
      </svg>
    </>
  )
};
