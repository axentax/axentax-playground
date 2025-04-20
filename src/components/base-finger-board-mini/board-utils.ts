import { Base12Sym, IKey } from "axentax-compiler";

/**
 * 平均律幅の配列作成
 * @param scaleLength 
 * @param upToFret 
 * @returns 
 */
export function calculateFretPositions(scaleLength: number, upToFret: number): number[] {
  // フレット位置を計算する内部関数
  const fretPosition = (fret: number): number => scaleLength * (1 - 1 / Math.pow(2, fret / 12));
  // 1からupToFretまでのフレット位置を配列で返す
  const positions: number[] = [];
  for (let i = 0; i <= upToFret; i++) {
      positions.push(fretPosition(i));
  }
  return positions;
}

/**
 * チューニングに則った1フレットから始まる指板キーリスト
 * @param tuning 
 * @returns 
 */
export function createFullBoardKeyList(tuning: IKey[]): IKey[][] {
  const res: IKey[][] = [];
  tuning.forEach(tKey => {
    const newRow = [...Base12Sym[tKey]];
    const startVal = newRow.shift() as IKey;
    newRow.push(startVal);
    res.push([...newRow, ...newRow]);
  })
  return res;
}
