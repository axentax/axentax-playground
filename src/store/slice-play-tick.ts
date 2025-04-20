import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PlayTick {
  seekTick: number,
  totalTick: number
}

const initialState: PlayTick = {
  seekTick: 0,
  totalTick: 0
}

export const playPropsSlice = createSlice({
  name: 'playTick',
  initialState,
  reducers: {
    setPlayTick: (state, action: PayloadAction<number>) => {
      state.seekTick = action.payload;
    },
    setTotalTick: (state, action: PayloadAction<number>) => {
      state.totalTick = action.payload;
    },
    // resetPlayTick: (state) => {
    //   state.seekTick = 0;
    // },
  }
});

// Action creators are generated for each case reducer function
export const {
  setPlayTick,
  setTotalTick,
  // resetPlayTick: resetSeek
} = playPropsSlice.actions;

export default playPropsSlice.reducer
