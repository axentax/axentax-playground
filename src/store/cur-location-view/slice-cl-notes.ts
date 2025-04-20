import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { NumberOrUfd, Styles, Tick, UntilNext } from 'axentax-compiler';

// noteSym, chord, tab, until、tick, activeBows

export interface INotes {
  tabObjId: number,
  isValid: boolean;
  noteSym: string;
  chord: string;
  tab: NumberOrUfd[];
  trueTab: NumberOrUfd[];
  activeBows: NumberOrUfd[];
  until: UntilNext;
  tick: Tick;
  style: Styles,
  // slideLandingTab?: NumberOrUfd[],
  // slideData?: SlideViewData
}

const initialState: INotes = {
  tabObjId: -1,
  isValid: false,
  noteSym: '',
  chord: '',
  tab: [],
  trueTab: [],
  activeBows: [],
  until: [-1, -1],
  tick: {} as Tick,
  style: {}
}

export const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    updateNotes: (state, action: PayloadAction<Partial<INotes>>) => {
      Object.assign(state, action.payload);
    },
    setNotes: (state, action: PayloadAction<INotes>) => {
      Object.assign(state, action.payload);
    },
    clearNotes: (state) => {
      Object.assign(state, initialState);
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  updateNotes,
  setNotes,
  clearNotes
} = notesSlice.actions;

export default notesSlice.reducer
