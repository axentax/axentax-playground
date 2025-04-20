import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Styles } from 'axentax-compiler';

export interface IBlockStyle {
  styles: Styles | null
}

const initialState: IBlockStyle = {
  styles: null
}

export const blockStylesSlice = createSlice({
  name: 'blockStyle',
  initialState,
  reducers: {
    setBlockStyles: (state, action: PayloadAction<IBlockStyle>) => {
      state.styles = action.payload.styles;
    },
    clearBlockStyles: (state) => {
      state.styles = null;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {
  setBlockStyles,
  clearBlockStyles
} = blockStylesSlice.actions;

export default blockStylesSlice.reducer
