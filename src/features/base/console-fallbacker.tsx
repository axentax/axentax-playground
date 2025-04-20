import React from 'react'
import { Overlay } from '../../components/overlay/overlay'

export const ConsoleFallbacker: React.FC = () => {
  return (
    <div>
      <Overlay backgroundColor='rgba(0, 0, 0, 1)'>
        <div>
          <img src="./assets/img/axentax-logo.png" alt="axentax" width="180" height="180" />
        </div>
        🔥 loading console 🔥
      </Overlay>
    </div>
  )
}
