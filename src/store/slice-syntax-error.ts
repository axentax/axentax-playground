import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ErrorInfo {
  message: string;
  line: number;
  linePos: number;
  token: string;
};

export interface SyntaxErrorState {
  info: ErrorInfo | null;
}

const initialState: SyntaxErrorState = {
  info: null
}

export const syntaxErrorSlice = createSlice({
  name: 'syntax-error',
  initialState,
  reducers: {
    setSyntaxError: (state, action: PayloadAction<ErrorInfo>) => {
      state.info = action.payload;
    },
    removeSyntaxError: (state) => {
      state.info = null;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  setSyntaxError,
  removeSyntaxError
} = syntaxErrorSlice.actions;

export default syntaxErrorSlice.reducer;
