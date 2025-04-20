import { useState } from 'react';

export type IsView = React.Dispatch<React.SetStateAction<boolean>>;
export type OnClickCallbackForOverlay = ((isView?: IsView) => void) | (() => void);

interface Props {
  /* クリック時のcallback */
  onClick?: OnClickCallbackForOverlay
  /* 背景色 */
  backgroundColor: string
  /* 子要素 */
  children?: React.ReactNode;
}

export const Overlay: React.FC<Props> = (props: Props) => {
  // オーバレイの表示状態を管理する state
  const [isVisible, setIsVisible] = useState(true);

  // オーバレイをクリックした時のハンドラ
  const handleClick = () => {
    if (props.onClick) {
      props.onClick(setIsVisible)
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: props.backgroundColor, // argv
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        font: '14em'
      }}
      onClick={handleClick}
    >
      <div style={{ fontSize: '20px', color: '#8d8d8d', textAlign: 'center' }}>
        {props.children}
      </div>
    </div>
  );
};
