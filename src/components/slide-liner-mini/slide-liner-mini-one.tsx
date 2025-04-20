import React from 'react'
import { SlideViewData } from '../../interfaces/slide-view-data';

interface Props {
  slide: SlideViewData,
  fullX?: number,
  fullY?: number,
}
export const SlideLinerMiniOne: React.FC<Props> = (props: Props) => {

  // stepなどの場合で、approachとslideが別noteの場合
  // 違いが侵食される可能性がある

  const fullX = props.fullX || 390;
  const fullY = props.fullX || 50;
  const _slide = props.slide;
  const offSet = _slide.totalStartTick;

  // 全てのデータからoffSetを減算
  const slide = normalizeOffset(_slide, offSet);

  const all = slide.totalEndTick; // 全長

  const inView = slide.approachList.map((ap, i) => {
    return <React.Fragment key={i}>
      <line
        x1={fullX * (ap.endTick / all) - 1}
        x2={fullX * (ap.endTick / all) - 1}
        y1={0}
        y2={fullY}
        stroke="#333"
      />
      <line
        x1={fullX * (ap.startTick / all)}
        x2={fullX * (ap.endTick / all) - 1}
        y1={25 + ((slide.approachList.length - i - 1) * (slide.approachUp ? 1 : -1))}
        y2={25 + ((slide.approachList.length - i - 1) * (slide.approachUp ? 1 : -1))}
        stroke="#378c80"
      />
    </React.Fragment>
  })

  const outView = slide.slideList.map((sl, i) => {

    return <React.Fragment key={i}>
      <line
        // x1={ all * (sl.startTick / all) }
        x1={fullX * (sl.startTick / all)}
        x2={fullX * (sl.startTick / all)}
        y1={0}
        y2={fullY}
        stroke="#333"
      />
      <line
        x1={fullX * (sl.startTick / all)}
        x2={fullX * (sl.endTick / all) - 1}
        y1={25 + (i * (!slide.slideUp ? 1 : -1))}
        y2={25 + (i * (!slide.slideUp ? 1 : -1))}
        stroke="#378c80"
      />
    </React.Fragment>
  })

  // console.log(slide, 'length', slide)

  return (
    <>
      {/* ref={props.svgRefGraph}  */}
      <svg width={fullX} height={fullY}>
        <rect x="0" y="0" width={fullX} height={fullY} fill="#000" />
        <line x1='0' y1={fullY / 2} x2={fullX} y2={fullY / 2} stroke="#333" />
        {inView}
        {outView}
        <line
          x1={fullX * (slide.middleStartTick / all)}
          y1={fullY / 2}
          x2={fullX * (slide.middleEndTick / all)}
          y2={fullY / 2}
          stroke="#378c80"
        />
        {/* <line
          x1={slide.middleEndTick}
          y1={0}
          x2={slide.middleEndTick}
          y2={fullY}
          stroke="#378c80"
        /> */}
      </svg>
    </>
  )
}

/**
 * 全てのデータからoffSetを減算
 * @param _slide 
 * @param offset 
 * @returns 
 */
function normalizeOffset(_slide: SlideViewData, offset: number): SlideViewData {

  const slide = structuredClone(_slide);
  slide.approachList.forEach(f => {
    f.startTick -= offset;
    f.endTick -= offset;
  });
  slide.slideList.forEach(f => {
    f.startTick -= offset;
    f.endTick -= offset;
  });
  slide.middleStartTick -= offset;
  slide.middleEndTick -= offset;
  slide.totalStartTick -= offset;
  slide.totalEndTick -= offset;

  return slide;
}