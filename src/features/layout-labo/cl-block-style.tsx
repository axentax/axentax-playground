import { Styles } from 'axentax-compiler';


export const CLBlockStyle = (blockStyle: Styles | null) => {
  return (
    blockStyle
      ? (
        <div>
          BlockStyle: [ {Object.keys(blockStyle).join()} ]
        </div>
      )
      : <div>BlockStyle:</div>
  )
}
