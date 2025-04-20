import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LSItemName, LSRepo } from '../../repository/local-storage-repo';

export type fullScreenMode = 0 | 1;

export interface WindowControl {
  fullScreen: fullScreenMode,
  leftColumn: boolean,
  leftColumnSize: number
  rightColumn: boolean,
  rightColumnSize: number
}

const initialState: WindowControl = {
  fullScreen: (() => {
    const mode = LSRepo.getItem(LSItemName.FullScreenMode);
    if (mode === null) return 1;
    return mode && mode === '1' ? 1 : 0
  })(),
  leftColumn: true,
  leftColumnSize: 300, // 未反映
  rightColumn: (() => {
    const mode = LSRepo.getItem(LSItemName.RightColumn);
    return mode && mode === 'true' ? true : false
  })(),
  rightColumnSize: 300 // 未反映
}

export const windowControl = createSlice({
  name: 'statusOfSettings',
  initialState,
  reducers: {
    changeFullScreen(state, action: PayloadAction<fullScreenMode>) {
      state.fullScreen = action.payload;
      LSRepo.setItem(LSItemName.FullScreenMode, action.payload.toString());
    },
    toggleLeftColumn(state) {
      state.leftColumn = !state.leftColumn;
    },
    setLeftColumn(state, action: PayloadAction<boolean>) {
      state.leftColumn = action.payload
    },
    toggleRightColumn(state) {
      state.rightColumn = !state.rightColumn;
      LSRepo.setItem(LSItemName.RightColumn, state.rightColumn ? 'true' : 'false');
    },
    setRightColumn(state, action: PayloadAction<boolean>) {
      state.rightColumn = action.payload
    },
    updateLeftColumnSize: (state, action: PayloadAction<number>) => {
      state.leftColumnSize = action.payload;
    },
    updateRightColumnSize: (state, action: PayloadAction<number>) => {
      state.rightColumnSize = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  changeFullScreen,
  toggleLeftColumn,
  setLeftColumn,
  toggleRightColumn,
  setRightColumn,
  updateLeftColumnSize,
  updateRightColumnSize
} = windowControl.actions;

export default windowControl.reducer
