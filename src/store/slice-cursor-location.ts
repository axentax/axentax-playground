import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CursorLocation {
  line: number;
  column: number;
}

const initialState: CursorLocation = {
  line: -1,
  column: -1,
}

export const cursorLocationSlice = createSlice({
  name: 'tmp',
  initialState,
  reducers: {
    setCursorLocation: (state, action: PayloadAction<CursorLocation>) => {
      state.line = action.payload.line;
      state.column = action.payload.column;
    },
    clearCursorLocation: (state) => {
      state.line = -1;
      state.column = -1;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setCursorLocation,
  clearCursorLocation
} = cursorLocationSlice.actions;

export default cursorLocationSlice.reducer
