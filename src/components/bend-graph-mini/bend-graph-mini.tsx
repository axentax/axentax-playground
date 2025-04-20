import React from 'react'
import { Bend } from 'axentax-compiler';

interface Props {
  bendFlatData: Bend[] | null,
  fullX: number,
  fullY: number,
  startTick: number,
  stopTick: number,
}
export const BendGraphMini: React.FC<Props> = (props: Props) => {

  // console.log('props>>', props)

  const fullX = props.fullX;
  const fullY = props.fullY;
  const centerY = props.fullY / 2;

  const bd = props.bendFlatData;
  if (!bd?.length) return;
  // console.log('bd', bd)

  // if (!bd) return null;

  let points: JSX.Element = (<></>);

  const startTick = props.startTick || (bd ? bd[0].tick : 0);
  const stopTick = props.stopTick || (bd ? bd[bd.length - 1].tick : 0);

  if (bd && bd.length > 1) {
    // normalize
    const nbd = bd.map(m => {
      // const tick = m.tick - bd[0].tick;
      const tick = m.tick - startTick;
      return {
        pitch: m.pitch, // たまにNaNが混じってる?? 大元に問題か? => node側で解決 : if (!TickBetweenVal) return [];
        tick: tick
      }
    })
    // const lastTick = nbd[nbd.length - 1].tick;
    const lastTick = stopTick - startTick;

    points = (<>
      {
        nbd.map((m, i) => {
          const cy = (centerY + (centerY - 2) * (m.pitch / 8191) * -1);
          return <React.Fragment key={i}>
            { <circle
              cx={ (fullX * (m.tick / lastTick)).toString() }
              cy={ cy.toString() }
              r="1" fill="#378c80"
            />
            }
            {/* <line
              x1={ fullX * (m.tick / lastTick) }
              y1={ 30 }
              x2={ fullX * (m.tick / lastTick) }
              y2={ 30 + 28 * (m.pitch / 8191) * -1 }
              stroke="#378c80"
            /> */}
          </React.Fragment>
        })
      }
    </>);

    // console.log('nbd.length', nbd.length)

  }

  return (
    <>
      {/* ref={props.svgRefGraph}  */}
      <svg width={fullX} height={fullY}>
        <rect x="0" y="0" width={fullX} height={fullY} fill="#000" />
        <line x1='0' y1={fullY / 2} x2={fullX} y2={fullY / 2} stroke="#333" />
        {/* <text
          x={ 4 }
          y={ 4 }
          fontFamily="self"
          fontWeight="normal"
          textAnchor="start"
          dominantBaseline="text-before-edge"
          color="#555"
          fontSize={10}
        >Bend</text> */}
        {points ? points : null}
      </svg>
    </>
  )
}
