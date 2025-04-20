// import { useSelector } from "react-redux";
import store, { RootState } from "../store/store";
import { useEffect, useRef } from "react";

export function useSubscribe<T>(
  selector: (state: RootState) => T,
  onChange: (newValue: T) => void
) {
    const currentValue = useRef<T>(selector(store.getState()));
    const onChangeRef = useRef(onChange);

    const setCurrentValue = (value: T) => {
      currentValue.current = value;
    }

    useEffect(() => {
      onChangeRef.current = onChange; // 最新の onChange 関数を ref に保持
    }, [onChange]);
  
    useEffect(() => {
      const checkForChanges = () => {
        const newValue = selector(store.getState());
        if (currentValue.current !== newValue) {
          onChangeRef.current(newValue);
          currentValue.current = newValue;
        }
      };
  
      const unsubscribe = store.subscribe(checkForChanges);
      return () => {
        unsubscribe(); // コンポーネントのアンマウント時に購読を解除
      }
    }, []); // 空の依存配列で初期マウント時にのみ購読を設定

    return { setCurrentValue }
  }