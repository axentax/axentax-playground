import { Base12Sym, IKey } from "axentax-compiler";

// target
export const targetFretLoc = [
  27, // 1
  76, // 2
  125, // 3
  174, // 4
  221, // 5
  268, // 6
  315, // 7
  361, // 8
  407, // 9
  452, // 10
  496, // 11
  541, // 12
  582, // 13
  618, // 14
  654, // 15
  688, // 16
  721, // 17
  754, // 18
  785, // 19
  816, // 20
  845, // 21
  874, // 22
  902, // 23
  928, // 24
];

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
