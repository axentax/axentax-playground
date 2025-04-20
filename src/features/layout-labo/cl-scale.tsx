import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';

// 同じように degree のキー等々も保持して表示

export const CLScale = () => {

  const scale = useSelector((state: RootState) => state.currentScale);

  // if (scale.key === '') return null;

  return (
    scale.isValid
      // ? (<div>Scale: { scale.key } { scale.name } { scale.bin } { Math.random() }</div>)
      ? (<>{scale.bin}</>)
      : <div>Scale:</div>
  )
}
