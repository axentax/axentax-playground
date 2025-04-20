import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export interface IFileProp {
  fileName: string,
  filePath: string | null,
  isSaved: boolean;
}

const initialState: IFileProp = {
  fileName: 'Untitled-1',
  filePath: null,
  isSaved: false
}

export const filePropSlice = createSlice({
  name: 'fileProp',
  initialState,
  reducers: {
    updateFileProp: (state, action: PayloadAction<Partial<IFileProp>>) => {
      Object.assign(state, action.payload);
    },
    setFileProp: (state, action: PayloadAction<IFileProp>) => {
      Object.assign(state, action.payload);
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  updateFileProp,
  setFileProp
} = filePropSlice.actions;

export default filePropSlice.reducer
