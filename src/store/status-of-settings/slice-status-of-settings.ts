import { createSlice } from '@reduxjs/toolkit';
import type { Draft, PayloadAction } from '@reduxjs/toolkit';

export interface IStatusOfSettings {
  /**
   * ユーザー操作で決定する"play中のsyntax追跡"
   */
  followEditorLineWhenPlaying: boolean;
  indentSpaceLevel: number,
  exampleC: string
}

const initialState: IStatusOfSettings = {
  followEditorLineWhenPlaying: true,
  indentSpaceLevel: 2,
  exampleC: 'isExampleC'
}

export const statusOfSettings = createSlice({
  name: 'statusOfSettings',
  initialState,
  reducers: {
    toggleFollowEditorLineWhenPlaying(state) {
      state.followEditorLineWhenPlaying = !state.followEditorLineWhenPlaying;
    },
    updateSetting: <T extends keyof IStatusOfSettings>(state: Draft<IStatusOfSettings>, action: PayloadAction<{ key: T; value: IStatusOfSettings[T] }>) => {
      const { key, value } = action.payload;
      state[key] = value;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  toggleFollowEditorLineWhenPlaying,
  updateSetting
} = statusOfSettings.actions;

export default statusOfSettings.reducer
