import React from 'react';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

export const CLCursor = React.memo(() => {

  const cursor = useSelector((state: RootState) => state.cursorLocation);
  return (
    cursor
      ? (<>{cursor.line}:{cursor.column}</>)
      : <>-:-</>
  );
});
