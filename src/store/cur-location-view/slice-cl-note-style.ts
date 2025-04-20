import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Styles } from 'axentax-compiler';

export interface INoteStyle {
  styles: Styles | null
}

const initialState: INoteStyle = {
  styles: null
}

export const noteStyleSlice = createSlice({
  name: 'noteStyle',
  initialState,
  reducers: {
    setNoteStyle: (state, action: PayloadAction<INoteStyle>) => {
      state.styles = action.payload.styles;
    },
    clearNoteStyle: (state) => {
      state.styles = null;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {
  setNoteStyle,
  clearNoteStyle
} = noteStyleSlice.actions;

export default noteStyleSlice.reducer
