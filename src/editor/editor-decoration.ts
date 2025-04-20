import { EditorInstanceStore } from "./editor-instance-store";

import styles from './editor.module.scss';

export enum DecorationType {
  Error = 'error',
  LineNumber = 'lineNumber',
  PlaySymDual_0 = 'playSymDual_0',
  PlaySymDual_1 = 'playSymDual_1',
  PlaySymDual_2 = 'playSymDual_2',
}

export class EditorDecoration {

  private static queueStore: {
    [key in DecorationType]: string[];
  } = {
      [DecorationType.Error]: [],
      [DecorationType.LineNumber]: [],
      [DecorationType.PlaySymDual_0]: [],
      [DecorationType.PlaySymDual_1]: [],
      [DecorationType.PlaySymDual_2]: [],
    }

  /**
   * set
   * @param dt 
   * @param location 
   * @param classNAme?
   */
  public static set(
    dt: DecorationType,
    location: {
      startLineNumber: number,
      startColumn: number,
      endLineNumber: number,
      endColumn: number
    },
    className?: string
  ) {
    const { monaco, editor } = EditorInstanceStore.getEditor();
    const newDecorations = [{
      range: new monaco.Range(location.startLineNumber, location.startColumn, location.endLineNumber, location.endColumn),
      options: {
        inlineClassName: className !== undefined ? className : styles['decoration-' + dt]
      }
    }];

    const ids = editor.deltaDecorations([], newDecorations);
    this.queueStore[dt] = [...this.queueStore[dt], ids[0]];
  }

  /**
   * clear
   * @param dt 
   * @returns 
   */
  public static clear(dt: DecorationType) {
    if (this.queueStore[dt].length === 0) return;

    const { editor } = EditorInstanceStore.getEditor();
    editor.deltaDecorations(this.queueStore[dt], []);
    this.queueStore[dt] = [];
  }

}

