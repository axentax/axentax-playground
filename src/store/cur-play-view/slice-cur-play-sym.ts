import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { NumberOrUfd, Region, StepInfo, Styles, Tick } from 'axentax-compiler';
// import { INoteStyle } from '../cur-location-view/slice-cl-note-style';

export interface ICurPlaySym {
  symArrObj: {
    [keys: number]: {
      id: number,
      tick: Tick,
      note: string | undefined,
      noteStr: string | undefined,
      tab: NumberOrUfd[],
      trueTab: NumberOrUfd[],
      activeTab: NumberOrUfd[],
      velocity: NumberOrUfd[],
      shifted: number[],
      stepInfo: {
        orderIndex: number,
        info: StepInfo
      } | null,
      location: {
        line: number,
        linePos: number
      },
      region: Region,
      // scale: IScale // playViewで scaleは使用しない
      style: Styles
    } | null
  }
}

const initialState: ICurPlaySym = {
  symArrObj: {
    0: null,
    1: null,
    2: null
  }
}

export const curPlaySym = createSlice({
  name: 'curPlaySym',
  initialState,
  reducers: {
    updateSymArrObj(state, action: PayloadAction<{ index: number; value: ICurPlaySym['symArrObj'][number] }>) {
      state.symArrObj[action.payload.index] = action.payload.value;
    },
    clearSymArrObj(state) {
      state.symArrObj = initialState.symArrObj;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  updateSymArrObj,
  clearSymArrObj
} = curPlaySym.actions;

export default curPlaySym.reducer
