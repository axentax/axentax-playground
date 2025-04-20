// import React from 'react'
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { IconStyleMap } from '../../components/style-icon/icon-style-map';

export const ClNoteAllStyles = () => {

  const styles = useSelector((state: RootState) => state.currentNotes.style, isEqual);

  const styleKeys = Object.keys(styles)

  return (
    <>
      <div>ClNoteAllStyles { styleKeys.join() }</div>
      <IconStyleMap />
    </>
  )
}
