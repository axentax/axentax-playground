import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export const ClNoteStyle = () => {

  const noteStyle = useSelector((state: RootState) => state.currentNoteStyle.styles);
  if (!noteStyle) return;

  const noteStyleKey = Object.keys(noteStyle);
  if (!noteStyleKey.length) return;

  return (
    <>
      noteStyle: icon.. { noteStyleKey } noteのstyle(単体を差しているのでstyle詳細(便利ツール)/documentに誘導)
    </>
  )
}
