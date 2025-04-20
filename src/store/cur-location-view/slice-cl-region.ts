import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'axentax-compiler';


export interface IClRegion {
  region: Region | null,
  // tuning: IKey[]
}

const initialState: IClRegion = {
  region: null,
  // tuning: ['E', 'A', 'D', 'G', 'B', 'E']
}

export const clRegionSlice = createSlice({
  name: 'clRegionStyles',
  initialState,
  reducers: {
    setClRegion: (state, action: PayloadAction<IClRegion['region']>) => {
      state.region = action.payload;
    },
    clearClRegion: (state) => {
      state.region = null;
    },
    // setClTuning: (state, action: PayloadAction<IClRegion['tuning']>) => {
    //   state.tuning = action.payload;
    // },
  },
})

// Action creators are generated for each case reducer function
export const {
  setClRegion,
  clearClRegion,
  // setClTuning
} = clRegionSlice.actions;

export default clRegionSlice.reducer
