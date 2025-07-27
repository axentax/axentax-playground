import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export enum PlayStatusEN {
  STOP,
  PLAY,
  COMPILE
}

export interface PlayStatus {
  status: PlayStatusEN
}

const initialState: PlayStatus = {
  status: PlayStatusEN.STOP
}

// let startTime: number = 0;

export const playStatusSlice = createSlice({
  name: 'playStatus',
  initialState,
  reducers: {
    setPlayStatus: (state, action: PayloadAction<PlayStatusEN>) => {

      // if (action.payload === PlayStatusEN.COMPILE) startTime = new Date().getTime();
      // if (action.payload === PlayStatusEN.PLAY) {
      //   // console.log('ctt:', (new Date().getTime() - startTime))
      //   startTime = 0;
      // }

      state.status = action.payload;
    },
  }
});

// Action creators are generated for each case reducer function
export const {
  setPlayStatus
} = playStatusSlice.actions;

export default playStatusSlice.reducer
