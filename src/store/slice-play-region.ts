import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'axentax-compiler';

export interface PlayRegion {
  region: Region | null
}

const initialState: PlayRegion = {
  region: null
}

export const playRegionSlice = createSlice({
  name: 'playRegion',
  initialState,
  reducers: {
    updatePlayRegion: (state, action: PayloadAction<Region>) => {
      state.region = action.payload;
    },
    resetRegion: (state) => {
      state.region = null;
    },
  }
});

// Action creators are generated for each case reducer function
export const {
  updatePlayRegion,
  resetRegion
} = playRegionSlice.actions;

export default playRegionSlice.reducer
