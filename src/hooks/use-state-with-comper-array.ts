import { useCallback, useState } from "react";

/**
 * 比較して変化があればsetするカスタムuseState ※未使用
 * @param initialValue 
 * @returns 
 */
export const useStateWithComparisonArray = <T>(
  initialValue: T[],
  // compareFunction?: (a: T[], b: T[]) => boolean
): [T[], (newValue: T[]) => void] => {

  const [value, setValue] = useState<T[]>(initialValue);

  const defaultCompareFunction = (a:T[], b: T[]): boolean => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  };

  const setCustomValue = useCallback((newValue: T[]) => {
    if (!defaultCompareFunction(value, newValue)) {
      setValue(newValue);
    }
  }, [value, defaultCompareFunction]);

  return [value, setCustomValue];
}
