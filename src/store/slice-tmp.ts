import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ITmp {
  tmpName: string;
  tmpAge: number;
}

const initialState: ITmp = {
  tmpName: '',
  tmpAge: 0,
}

export const tmpSlice = createSlice({
  name: 'tmp',
  initialState,
  reducers: {
    setTmp: (state, action: PayloadAction<ITmp>) => {
      state.tmpName = action.payload.tmpName;
      state.tmpAge = action.payload.tmpAge;
    },
    removeTmp: (state) => {
      state.tmpName = '';
      state.tmpAge = 0;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setTmp,
  removeTmp
} = tmpSlice.actions;

export default tmpSlice.reducer
