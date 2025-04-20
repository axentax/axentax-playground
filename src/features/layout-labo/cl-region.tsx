import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const ClRegion = React.memo(() => {

  const region = useSelector((state: RootState) => state.clRegion.region);

  return (
    region
      ? (<>{ region.id } dualId:{ region.dualId }</>)
      // ? (<div>Region: r:{ region.id } dualId:{ region.dualId } until:{ region.untilNext.join('/') } bpm:{ region.bpm } { region.tuning.join() }, tick:{ region.startLayerTick } { Math.random() }</div>)
      // ? (<div>Region: r:{ region.id } dualId:{ region.dualId }, bpm:{ region.bpm }, start/end:{ [region.startLayerTick, "/", region.endLayerTick] } | ts: { [region.trueStartLayerTick, "/", region.trueEndLayerTick] }</div>)
      : (<></>)
  )
});
