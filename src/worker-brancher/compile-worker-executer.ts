/* eslint @typescript-eslint/no-explicit-any: off */
import compileWorker from "../workers/worker-for-compile?worker";
import { v4 as uuid } from 'uuid';

export interface ICompileWorkerExecutorSetMessage {
  id?: any,
  hasStyleCompile: boolean,
  hasMidiCompile: boolean,
  syntax: string
}

export class CompileWorkerExecutor {
  private static instance: CompileWorkerExecutor;
  private compileWorker = new compileWorker();
  private callbackBranch = new Map<any, (elm: any) => void>();
  private constructor() {}

  public static getInstance(): CompileWorkerExecutor {
    if (!CompileWorkerExecutor.instance) {
      // singleton init
      CompileWorkerExecutor.instance = new CompileWorkerExecutor();
      // worker受信設定
      CompileWorkerExecutor.instance.compileWorker.onmessage = (event) => {
        const cb = CompileWorkerExecutor.instance.callbackBranch.get(event.data.id);
        if (!cb) throw 'Unknown worker response callback. id: ' + event.data.id;
        // console.log('id:', event.data.id)
        cb(event.data);
      }
    }
    return CompileWorkerExecutor.instance;
  }

  /**
   * send worker message
   * @param data ICompileWorkerExecutorSetMessage
   * @param responseCB (elm) => void
   */
  public setMessage(data: ICompileWorkerExecutorSetMessage, responseCB: (elm: any) => void) {
    // console.log('- setMessage')
    data.id = data.id ? data.id : uuid();
    this.callbackBranch.set(data.id, responseCB);
    CompileWorkerExecutor.instance.compileWorker.postMessage(data)
  }
}
