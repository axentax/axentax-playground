import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { BendMidiSetter } from 'axentax-compiler';


export interface IClBend {
  bend: BendMidiSetter[] | null,
}

const initialState: IClBend = {
  bend: null,
}

export const clBendSlice = createSlice({
  name: 'clRegionStyles',
  initialState,
  reducers: {
    setClBend: (state, action: PayloadAction<IClBend['bend']>) => {
      state.bend = action.payload;
    },
    clearClBend: (state) => {
      state.bend = null;
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setClBend,
  clearClBend,
  // setClTuning
} = clBendSlice.actions;

export default clBendSlice.reducer
