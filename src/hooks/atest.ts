import { useRef } from "react";

export const ATest = () => {

  const ref = useRef<number>(0);

  const v = () => {
    console.log(ref.current)
  }

  return { ref, v }
}

