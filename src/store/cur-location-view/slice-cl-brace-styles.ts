import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Styles } from 'axentax-compiler';

/*
@@ { C D:step(123) }
- ここは null -
@@ { E F - ここは [] - }
*/

export interface IBraceStyles {
  styles: Styles | null
}

const initialState: IBraceStyles = {
  styles: null
}

export const braceStylesSlice = createSlice({
  name: 'braceStyles',
  initialState,
  reducers: {
    setBraceStyles: (state, action: PayloadAction<IBraceStyles>) => {
      state.styles = action.payload.styles;
    },
    clearBraceStyles: (state) => {
      state.styles = null;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {
  setBraceStyles,
  clearBraceStyles
} = braceStylesSlice.actions;

export default braceStylesSlice.reducer
