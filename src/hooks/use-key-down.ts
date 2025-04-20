import { useEffect } from 'react';

interface UseKeyDownOptions {
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export const useKeyDown = (
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  options?: UseKeyDownOptions[]
) => {

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // スペースキーを正規化
      const key = event.key === 'Spacebar' ? ' ' : event.key;

      if (!keys.includes(key)) {
        return;
      }

      // optionsが未指定または空の場合、デフォルトで[undefined]を設定
      const optArray = (options && options.length > 0) ? options : [undefined];

      const isMatch = optArray.some((opt) => {
        if (!opt) {
          // optionsが未指定の場合、修飾キーのチェックをスキップ
          return true;
        }
        return (
          (opt.ctrlKey === undefined || event.ctrlKey === opt.ctrlKey) &&
          (opt.metaKey === undefined || event.metaKey === opt.metaKey) &&
          (opt.shiftKey === undefined || event.shiftKey === opt.shiftKey) &&
          (opt.altKey === undefined || event.altKey === opt.altKey)
        );
      });

      if (isMatch) {
        event.preventDefault();
        callback(event);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callback, options]);
}
