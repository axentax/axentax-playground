import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SlideViewData } from '../../interfaces/slide-view-data';

export interface IClSlide {
  slide: SlideViewData | null,
}

const initialState: IClSlide = {
  slide: null,
}

export const clSlideSlice = createSlice({
  name: 'clRegionStyles',
  initialState,
  reducers: {
    setClSlide: (state, action: PayloadAction<IClSlide['slide']>) => {
      state.slide = action.payload;
    },
    clearClSlide: (state) => {
      state.slide = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setClSlide,
  clearClSlide,
  // setClTuning
} = clSlideSlice.actions;

export default clSlideSlice.reducer
