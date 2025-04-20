import { createSlice } from '@reduxjs/toolkit';
import type { Draft, PayloadAction } from '@reduxjs/toolkit';

export interface ISystemStatus {
  initializedSystem: boolean,
  existAnnotationCompose: boolean
}

const initialState: ISystemStatus = {
  initializedSystem: false,
  existAnnotationCompose: false
}

export const statusOfSystemState = createSlice({
  name: 'statusSystemState',
  initialState,
  reducers: {
    updateSystemState: <T extends keyof ISystemStatus>(state: Draft<ISystemStatus>, action: PayloadAction<{ key: T; value: ISystemStatus[T] }>) => {
      const { key, value } = action.payload;
      state[key] = value;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  updateSystemState
} = statusOfSystemState.actions;

export default statusOfSystemState.reducer
