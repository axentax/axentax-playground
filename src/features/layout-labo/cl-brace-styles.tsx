import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

export const CLBraceStyles = () => {

  const braceStyle = useSelector((state: RootState) => state.currentBraceStyles).styles;

  // if (!braceStyle) return null;

  return (
    braceStyle
      ? (
        <div>
          BraceStyles: [ {Object.keys(braceStyle).join()} ] noteのstyleも併せてicon
        </div>
      )
      : <div>BraceStyles: -</div>
  )
}
