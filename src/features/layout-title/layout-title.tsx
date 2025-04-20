import styles from './layout-title.module.scss';
// import { CLCursor } from '../layout-labo/cl-cursor';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/store';
import { Platform, PlatformConfiguration } from '../../settings';
import { Filer } from '../../@x-electron/filer/filer';
import { FaGithub } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";


export const LayoutTitle = () => {

  // const playStatus = useSelector((state: RootState) => state.playStatus.status);

  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        {/* {props.children} */}
        {PlatformConfiguration.Platform === Platform.electron
          ? <Filer />
          : <>{PlatformConfiguration.title}</>
        }
      </div>
      <div className={`${styles.right} commonBG`}>
        {/* status:{playStatus} _ username */}
        <div>
          <a href='https://github.com/axentax/axentax-playground' target='_blank'><FaGithub size="22px" /></a>
        </div>
        <div>
          <a href='https://x.com/_axentax_' target='_blank'><FaSquareXTwitter size="22px" /></a>
        </div>
      </div>  
    </div>
  )
};
