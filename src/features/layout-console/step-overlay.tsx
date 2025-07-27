import React from 'react'
import { OnClickCallbackForOverlay, Overlay } from '../../components/overlay/overlay'
import { XSynth } from '../../synth/x-synth';
import { Platform, PlatformConfiguration } from '../../settings';

interface Props {
  onClick?: OnClickCallbackForOverlay;
  backgroundColor?: string;
  children: React.ReactNode;
}

export const ConsoleStepOverlay: React.FC<Props> = (props: Props) => {

  // electron及び開発時のみシンセの自動初期化
  // if (
  //   (import.meta.env.DEV && props.onClick)
  //   || PlatformConfiguration.Platform === Platform.electron
  // ) {
  //   XSynth.initLocal(() => {})
  //   return null;
  // }

  return (
    <>
      <div>
        <Overlay
          backgroundColor={props.backgroundColor ? props.backgroundColor : 'rgba(0, 0, 0, 1)'}
          onClick={props.onClick}>
          <div>
            <img src="./assets/img/axentax-logo.png" alt="axentax" width="180" height="180" />
          </div>
          {props.children}
        </Overlay>
      </div>
    </>
  )
}
