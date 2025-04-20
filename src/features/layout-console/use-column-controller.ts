import { useState } from "react";
import { PlatformConfiguration } from "../../settings";


export const useColumnController = (
  defaultLeftColumnWidth: number | null,
  defaultRightColumnWidth: number | null,
) => {

  // const [rightColumnVisible, setRightColumnVisible] = useState(defaultRightColumnVisible);
  // const [leftColumnVisible, setLeftColumnVisible] = useState(defaultLeftColumnVisible);
  const [leftColumnWidth, setLeftColumnWidth] = useState(defaultLeftColumnWidth || 250);
  const [rightColumnWidth, setRightColumnWidth] = useState(defaultRightColumnWidth || PlatformConfiguration.defaultRightColumnWidth);

  // const toggleLeftColumn = () => {
  //   setLeftColumnVisible(!leftColumnVisible);
  // };

  // const toggleRightColumn = () => {
  //   setRightColumnVisible(!rightColumnVisible);
  // };

  const handleMouseDownLeft = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const startX = event.clientX;
    const startWidth = leftColumnWidth;

    const mouseMoveHandler = (e: { clientX: number }) => {
      const newWidth = startWidth + e.clientX - startX;
      setLeftColumnWidth(newWidth);
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  const handleMouseDownRight = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const startX = event.clientX;
    const startWidth = rightColumnWidth;

    const mouseMoveHandler = (e: { clientX: number }) => {
      const newWidth = startWidth + startX - e.clientX;
      setRightColumnWidth(newWidth);
    };

    const mouseUpHandler = () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  return {
    // leftColumnVisible,
    // rightColumnVisible,
    leftColumnWidth,
    rightColumnWidth,
    handleMouseDownLeft,
    handleMouseDownRight,
    // toggleRightColumn,
    // toggleLeftColumn,
  }
}