import { ConvertToObj } from "axentax-compiler/dist/conductor/conductor";
import { DecorationType, EditorDecoration } from "./editor-decoration";
import { EditorInstanceStore } from "./editor-instance-store";
import store from "../store/store";
import { global } from "../settings";
import { XViewUtils } from "../utils/utils";
import { XSynth } from "../synth/x-synth";
import { ConductStore } from "../conduct/conduct-store";
import { SysSettings } from "axentax-compiler";
import { LSItemName, LSRepo } from "../repository/local-storage-repo";


export class EditorControl {

  /**
   * 指定行にジャンプ
   * @param line 
   */
  static jumpToLine(line: number) {
    const editor = EditorInstanceStore.getEditor().editor;
    if (editor) {
      editor.revealLineInCenter(line, 1); // scrollType: 0 or 1
    }
  }

  /**
   * 行番号クリックで、バージョン一致の場合は行番号の再生位置にjumpする
   */
  static lineNumberClickHandler() {
    const { editor, monaco } = EditorInstanceStore.getEditor();

    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS) {
        const clickLineNumber = e.target.position?.lineNumber;
        // console.log(`Line number ${clickLineNumber} was clicked.`);

        // バージョン確認
        const versionMatched = store.getState().syntaxMatchVersion.matched;
        if (!versionMatched) {
          // バージョン違い
          // const playStatus = store.getState().playStatus.status;
          // if (playStatus === PlayStatusEN.PLAY) {
          //   stopCB();
          //   // playCB();
          // } else if (playStatus === PlayStatusEN.STOP) {
          //   console.log(11111)
          //   playCB();
          // }
          return;
        }

        // conduct確認
        // const conduct = ccp.getConductCurPlaying();
        const conduct = ConductStore.getPlayObj();
        if (!conduct) return;

        // 一番最初に clickLineNumber が出現する tabObjのtick を dual全てから 探索
        let targetMinTick = 0;
        for (let dualId = 0; dualId < global.dualLength; dualId++) {

          const toList = conduct.mixesList[dualId].flatTOList;
          if (toList.length) {
            // 行番号から、tickを検索
            const res = XViewUtils.findStartTabObjByLineNumber(toList, clickLineNumber);
            if (res.to) {
              if (targetMinTick === 0 && res.to?.bar.startTick) {
                // 0のままだと常に targetMinTick が勝ってしまうので、まず前提値の代入必要
                targetMinTick = res.to?.bar.startTick;

                // さらに、そのnoteの弦の最小tickを検索
                res.to?.bar.fretStartTicks.forEach(f => {
                  if (f !== undefined && f < targetMinTick) {
                    targetMinTick = f;
                  }
                });

              } else if (targetMinTick !== 0 && res.to?.bar.startTick && res.to?.bar.startTick < targetMinTick) {
                // targetMinTickに0以外が代入されている場合、より小さいtickを代入
                targetMinTick = res.to?.bar.startTick;

                // さらに、そのnoteの弦の最小tickを検索
                res.to?.bar.fretStartTicks.forEach(f => {
                  if (f !== undefined && f < targetMinTick) {
                    targetMinTick = f;
                  }
                });
              }
            }
          }
        }
        XSynth.getInstance().setSeek(targetMinTick);
      }
    });
  }

  /**
   * Error decorator
   * @param err 
   */
  public static setErrorDecoration(err: ConvertToObj["error"] | null) {
    if (err && err.line > 0) {
      if (err.linePos > 0 && err.token !== null) {

        // range: new monaco.Range(err.line, err.linePos, err.line, err.linePos + err.token.length),
        EditorDecoration.set(DecorationType.Error, {
          startLineNumber: err.line,
          startColumn: err.linePos,
          endLineNumber: err.line,
          endColumn: err.linePos + err.token.length
        })

      } else {

        EditorDecoration.set(DecorationType.Error, {
          startLineNumber: err.line,
          startColumn: 1,
          endLineNumber: err.line,
          endColumn: err.linePos + (err.token?.length || 1)
        });
      }
    }
  }

  /**
   * clear error decoration
   */
  static clearErrorDecoration() {
    EditorDecoration.clear(DecorationType.Error);
  }

  /**
   * play sym decoration
   * @param dualId 
   * @param locations 
   * @param decoration 
   */
  public static setPlaySymDecoration(
    dualId: number,
    locations: {
      startLineNumber: number,
      startColumn: number,
      endLineNumber: number,
      endColumn: number
    },
    decoration?: string
  ) {
    const decorationType = DecorationType[('PlaySymDual_' + dualId) as keyof typeof DecorationType]
    EditorDecoration.set(decorationType, locations, decoration ? decoration : 'decoration-playSym')
  }

  /**
   * clear play sym decoration
   * @param dualId 
   */
  public static clearPlaySymDecoration(dualId: number) {
    const decorationType = DecorationType[('PlaySymDual_' + dualId) as keyof typeof DecorationType]
    EditorDecoration.clear(decorationType);
  }

  /**
   * clear play sym decoration
   * @param dualId 
   */
  public static clearAllPlaySymDecoration() {
    for (let dualId = 0; dualId < SysSettings.dualLength; dualId++) {
      const decorationType = DecorationType[('PlaySymDual_' + dualId) as keyof typeof DecorationType]
      EditorDecoration.clear(decorationType);
    }
  }

  /**
   * set editor font size
   * @param size 
   */
  public static setEditorFontsize(size: number) {
    EditorInstanceStore.getEditor().editor.updateOptions({
      fontSize: size
    });
    LSRepo.setItem(LSItemName.FontSize, size.toString());
  }

  public static getEditorFontsize() {
    const storageFontSize = parseInt(LSRepo.getItem(LSItemName.FontSize) || '0');
    if (!storageFontSize) {
      this.setEditorFontsize(global.defaultEditorFontSize);
      return global.defaultEditorFontSize;
    }
    return storageFontSize;
  }

}

