import React from 'react'
import { SlideViewData } from '../../interfaces/slide-view-data';

interface Props {
  slide: SlideViewData,
  fullX?: number,
  fullY?: number,
}
export const SlideLinerMiniSome: React.FC<Props> = (props: Props) => {

  // stepなどの場合で、approachとslideが別noteの場合
  // 違いが侵食される可能性がある

  const fullX = props.fullX || 390;
  const fullXHalf = fullX / 2;

  const fullY = props.fullX || 50;
  const _slide = props.slide;
  const offSetLeft = _slide.totalStartTick;
  const offsetRight = _slide.middleStartTick;

  // 全てのデータからoffSetを減算
  const slide = normalizeOffset(_slide, offSetLeft, offsetRight);

  // const all = slide.totalEndTick; // 全長

  const leftAll = slide.middleEndTick - slide.totalStartTick;
  const rightAll = slide.totalEndTick - slide.middleStartTick;

  const inView = slide.approachList.map((ap, i) => {
    return <React.Fragment key={i}>
      <line
        x1={fullXHalf * (ap.endTick / leftAll) - 1}
        x2={fullXHalf * (ap.endTick / leftAll) - 1}
        y1={0}
        y2={fullY}
        stroke="#333"
      />
      <line
        x1={fullXHalf * (ap.startTick / leftAll)}
        x2={fullXHalf * (ap.endTick / leftAll) - 1}
        y1={25 + ((slide.approachList.length - i - 1) * (slide.approachUp ? 1 : -1))}
        y2={25 + ((slide.approachList.length - i - 1) * (slide.approachUp ? 1 : -1))}
        stroke="#378c80"
      />
    </React.Fragment>
  })

  const outView = slide.slideList.map((sl, i) => {

    return <React.Fragment key={i}>
      <line
        x1={fullXHalf + fullXHalf * (sl.startTick / rightAll)}
        x2={fullXHalf + fullXHalf * (sl.startTick / rightAll)}
        y1={0}
        y2={fullY}
        stroke="#333"
      />
      <line
        x1={fullXHalf + fullXHalf * (sl.startTick / rightAll)}
        x2={fullXHalf + fullXHalf * (sl.endTick / rightAll) - 1}
        y1={25 + (i * (!slide.slideUp ? 1 : -1))}
        y2={25 + (i * (!slide.slideUp ? 1 : -1))}
        stroke="#378c80"
      />
    </React.Fragment>
  })

  // console.log(slide)


  return (
    <>
      {/* ref={props.svgRefGraph}  */}
      <svg width={fullX} height={fullY}>
        <rect x="0" y="0" width={fullX} height={fullY} fill="#000" />
        <line x1='0' y1={fullY / 2} x2={fullX} y2={fullY / 2} stroke="#333" />
        <line x1={fullX / 2} y1='20' x2={fullX / 2} y2={fullY - 20} stroke="#378c80" />

        {/* left */}
        {inView}
        <line
          x1={fullXHalf * (slide.approachList[slide.approachList.length - 1].endTick / leftAll)}
          y1={fullY / 2}
          x2={fullXHalf * (slide.middleEndTick / leftAll)}
          y2={fullY / 2}
          stroke="#378c80"
        />

        {/* right */}
        {outView}
        <line
          x1={fullXHalf}
          y1={fullY / 2}
          x2={fullXHalf + fullXHalf * (slide.slideList[0].startTick / rightAll)}
          y2={fullY / 2}
          stroke="#378c80"
        />

        <text
          x={fullXHalf}
          y={13}
          fontFamily="self"
          fontWeight="normal"
          textAnchor="middle"
          dominantBaseline="middle"
          color="#28665e"
          fontSize={12}
        >omitted</text>
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
function normalizeOffset(_slide: SlideViewData, offsetLeft: number, offsetRight: number): SlideViewData {

  const slide = structuredClone(_slide);
  slide.approachList.forEach(f => {
    f.startTick -= offsetLeft;
    f.endTick -= offsetLeft;
  });
  slide.slideList.forEach(f => {
    f.startTick -= offsetRight;
    f.endTick -= offsetRight;
  });
  slide.middleStartTick -= offsetRight;
  slide.middleEndTick -= offsetLeft;
  slide.totalStartTick -= offsetLeft;
  slide.totalEndTick -= offsetRight;

  return slide;
}