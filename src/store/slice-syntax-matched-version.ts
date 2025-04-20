import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ISyntaxMatched {
  matched: boolean;
}

const initialState: ISyntaxMatched = {
  matched: false
}

export const tmpSlice = createSlice({
  name: 'tmp',
  initialState,
  reducers: {
    setSyntaxMatchedVersion: (state, action: PayloadAction<ISyntaxMatched>) => {
      state.matched = action.payload.matched;
      // console.log('■ver比較結果:', state.match)
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setSyntaxMatchedVersion
} = tmpSlice.actions;

export default tmpSlice.reducer
