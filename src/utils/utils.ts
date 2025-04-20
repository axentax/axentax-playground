import { NumberOrUfd, TabObj } from "axentax-compiler";

export class XViewUtils {

  static scaleList() {
    // hint: 
    //   1. node側の createBasicBoard は、tuningと noteだけ入った ChordBag があれば
    //      スケール列をkey付きで作成できる
    //
    //   2. 単にIKeyの列を作りたければ Base12Sym を使って 24フレット分 を連結すればいい
  }

  static findNumber(numberOrUndefinedList: NumberOrUfd[]) {
    return numberOrUndefinedList.find(f => f !== undefined && f >= 0);
  }

  /**
   * 先頭の空白数
   * @param str 
   * @returns 
   */
  static countLeadingSpaces(str: string): number {
    const match = str.match(/^\s*/);
    return match ? match[0].length : 0;
  }

  /**
   * Remove comment statements from the syntax.
   * @param conduct 
   */
  static removeUnnecessaryInitials(syntax: string) {
    return syntax
      .replace(/ +$/gm, '')
      .replace(/\/\/.*$/gm, '')
      .replace(/ +$/gm, '')
    // .replace(/\/\*([\s\S]*?)\*\//gm, (match) => match.replace(/[^\n]/g, ' '))
    // .replace(/__end__.*$/sg, '');
  }

  static samplesToTimeWithArray(at: number): {
    min: string,
    sec: string,
    msec: string
  } {
    if (!at) at = 0;

    // ミリ秒を計算
    const ms = Math.ceil(at % 1000);

    // 秒単位で切り上げ
    const in_s = Math.ceil(at / 1000);
    const s = in_s % 60;

    // 分単位で切り捨て
    const min = (Math.floor(in_s / 60)); //.toString().padStart(2, '0');

    // 秒とミリ秒をフォーマット
    const sec = s === 0 ? '00' : s < 10 ? '0' + s : s;
    const msec = ms === 0 ? '000' : ms < 10 ? '00' + ms : ms < 100 ? '0' + ms : ms;

    // 分、秒、ミリ秒を結合して返す
    // const res = `${min}:${sec}`;
    return {
      min: '' + min,
      sec: '' + sec,
      msec: '' + msec
    };
  }

  /**
   * search only TabObj by lineNumber
   * @param to 
   * @param targetLine 
   * @returns 
   */
  static findStartTabObjByLineNumber(toList: TabObj[], targetLine: number) {
    for (let ti = 0; ti < toList.length; ti++) {
      const to = toList[ti];
      // 単純探索の場合、必ず dualIdの若いものが、若いtickだという前提
      if (to.syntaxLocation.line >= targetLine) {
        return { to, index: ti };
      }
    }
    return { to: null, index: -1 };
  }

  // /**
  //  * search only TabObj by lineNumber
  //  * @param to 
  //  * @param curTick 
  //  * @returns 
  //  */
  // static x_findStartTabObjByLineNumber(to: TabObj[], lineNumber: number) {
  //   let left = 0;
  //   let right = to.length - 1;

  //   while (left <= right) {
  //     const mid = left + Math.floor((right - left) / 2);
  //     if (to[mid].syntaxLocation.line === lineNumber) {
  //       // targetが範囲内にある場合
  //       return { to: to[mid], index: mid };
  //     } else if (to[mid].syntaxLocation.line < lineNumber) {
  //       left = mid + 1;
  //     } else {
  //       // targetがendより大きい場合、右側を探索
  //       right = mid - 1;
  //     }
  //   }

  //   if (left != 0) {
  //     return { to: to[left], index: left };
  //   }

  //   // 範囲内に含まれる区間がなく、target未満のstartを持つ最初の区間を返す
  //   return { to: null, index: -1 };
  // }

}
