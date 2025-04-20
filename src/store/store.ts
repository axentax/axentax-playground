import { configureStore } from '@reduxjs/toolkit'

import bendReducer from './cur-location-view/slice-cl-bend';
import braceStylesReducer from './cur-location-view/slice-cl-brace-styles';
import blockStyleReducer from './cur-location-view/slice-cl-block-style';
import noteStyleReducer from './cur-location-view/slice-cl-note-style';
import notesReducer from './cur-location-view/slice-cl-notes';
import scaleReducer from './cur-location-view/slice-cl-scale';
import slideReducer from './cur-location-view/slice-cl-slide';
import clRegionReducer from './cur-location-view/slice-cl-region';

import curPlaySymReducer from './cur-play-view/slice-cur-play-sym';

import fileStateReducer from './file-state/slice-file-prop';

import statusOfSettingsReducer from './status-of-settings/slice-status-of-settings';
import systemStateReducer from './status-of-settings/slice-system-status';
import windowControlReducer from './status-of-settings/slice-window-control';

import cursorLocationReducer from './slice-cursor-location';
import playBPMReducer from './slice-play-bpm';
import playRegionReducer from './slice-play-region';
import playPropsReducer from './slice-play-tick';
import playStatusReducer from './slice-play-status';
import syntaxErrorReducer from './slice-syntax-error';
import syntaxMatchVersionReducer from './slice-syntax-matched-version';
import tmpReducer from './slice-tmp';

export const store = configureStore({
  reducer: {
    currentBendData: bendReducer,
    currentBlockStyle: blockStyleReducer,
    currentBraceStyles: braceStylesReducer,
    currentNoteStyle: noteStyleReducer,
    currentNotes: notesReducer,
    currentScale: scaleReducer,
    currentSlideData: slideReducer,
    clRegion: clRegionReducer,

    curPlaySym: curPlaySymReducer,

    fileState: fileStateReducer,

    statusOfSettings: statusOfSettingsReducer,
    systemState: systemStateReducer,
    windowControl: windowControlReducer,

    cursorLocation: cursorLocationReducer,
    playBPM: playBPMReducer,
    playRegion: playRegionReducer,
    playTick: playPropsReducer,
    playStatus: playStatusReducer,
    syntaxError: syntaxErrorReducer,
    // syntaxVersion: syntaxVersionReducer,
    syntaxMatchVersion: syntaxMatchVersionReducer,
    tmp: tmpReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      actionCreatorCheck: false,
      immutableCheck: { warnAfter: 256 },
      serializableCheck: {
        warnAfter: 128,
        // シリアライズチェックを無視するアクションタイプを指定
        ignoredActions: [
          // midiDataSlice.actions.setMidiData.type,
          // synthSlice.actions.setSynth.type,
          // editorSlice.actions.setEditorInstance.type,
          // editorSlice.actions.setMonacoInstance.type,
          // editorSlice.actions.setEditorSet.type,
          // unStyleConductSlice.actions.setUnStyleConduct.type
        ],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: [
          // 'synth.core',
          // 'midiData.midi'
          // 'editorInstance.editor',
          // 'editorInstance.monaco',
          // 'editorInstance',
          // 'unStyleConduct.core'
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store;
