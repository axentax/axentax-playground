import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { bin12 } from 'axentax-compiler';

export interface IScale {
  isValid: boolean;
  name: string;
  key: string;
  bin: bin12;
}

const initialState: IScale = {
  isValid: false,
  name: '-',
  key: '-',
  bin: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

export const scaleSlice = createSlice({
  name: 'scale',
  initialState,
  reducers: {
    setScale: (state, action: PayloadAction<IScale>) => {
      // state.name = action.payload.name;
      // state.key = action.payload.key;
      // state.bin = action.payload.bin;
      Object.assign(state, action.payload);
    },
    clearScale: (state) => {
      Object.assign(state, initialState);
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {
  setScale,
  clearScale
} = scaleSlice.actions;

export default scaleSlice.reducer
