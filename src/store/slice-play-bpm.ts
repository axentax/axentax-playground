import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PlayBPM {
  bpm: number
}

const initialState: PlayBPM = {
  bpm: 0
}

export const playBPMSlice = createSlice({
  name: 'playBPM',
  initialState,
  reducers: {
    updatePlayBPM: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    },
    resetBPM: (state) => {
      state.bpm = 0;
    },
  }
});

// Action creators are generated for each case reducer function
export const {
  updatePlayBPM,
  resetBPM
} = playBPMSlice.actions;

export default playBPMSlice.reducer
