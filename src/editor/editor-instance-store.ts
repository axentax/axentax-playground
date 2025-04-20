import { EditorX, MonacoX } from "./editor";

type IEditorInstance = {
  monaco: MonacoX,
  editor: EditorX
}

export class EditorInstanceStore {

  private _editorId = 'customSyntax';

  private static instance: EditorInstanceStore;
  private editorInstance: IEditorInstance = {} as IEditorInstance;

  private constructor() { }

  public static editorId() {
    if (!EditorInstanceStore.instance) {
      EditorInstanceStore.instance = new EditorInstanceStore();
    }
    return this.instance._editorId;
  }

  public static setEditorInstance(instanceSet: IEditorInstance): void {
    if (!EditorInstanceStore.instance) {
      EditorInstanceStore.instance = new EditorInstanceStore();
    }
    this.instance.editorInstance = instanceSet;
  }

  public static getEditor(): IEditorInstance {
    if (!EditorInstanceStore.instance) {
      EditorInstanceStore.instance = new EditorInstanceStore();
    }
    return EditorInstanceStore.instance.editorInstance;
  }

  public static getInstance(): EditorInstanceStore {
    if (!EditorInstanceStore.instance) {
      EditorInstanceStore.instance = new EditorInstanceStore();
    }
    // 生成済みのインスタンスを返す
    return EditorInstanceStore.instance;
  }

}
