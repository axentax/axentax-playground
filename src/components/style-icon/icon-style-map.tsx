
// import styles from './icon-style-map.module.scss'

export const IconStyleMap = () => {

  return (
    <>
      <div>_map_</div>
      {/* <div style={{ 'height': '40' }}>
        <svg width="100" height="20" xmlns="http://www.w3.org/2000/svg">
          <g className={ styles.opa } onClick={ () => { console.log(111) }}>
            <rect x="0" y="0" width="100" height="20" fill="#000" stroke="none" rx="5" ry="5" fillOpacity="0" />
            <text x="50" y="15" fontSize="12" fill="#fff" textAnchor="middle">E</text>
          </g>
        </svg>
      </div> */}
    </>
  )
}


// iconの並びをまとめて作成して、propsで表示状況を指定する
// それか、更新頻度が高いため、react依存せず styleSeat で後指定する。
// ■プロパティ
// - アクティブ状態
// - instの種類
// - untilの値
// - 

/*

map,step,bend,slide
scaleX,degree
inst, until, velocity


*/
// Styles {
//   approach?: StyleApproach;
//   // bend?: StyleBendSet[];
//   bd?: StyleBendX[];
//   bpm?: {
//     style: StyleBPM;
//     /** group -1 is single. resolve with 'mod-style.distributeStyleWithinHierarchy' */
//     group: number;
//     /** group end tick. resolve with 'layer-compiler.resolveStyleGroup' */
//     groupEndTick: number;
//   };
//   // brushing?: StyleBrushing;
//   continue?: true;
//   delay?: StyleDelay;
//   inst?: ESInst;
//   degree?: DegreeObj; // not inherited
//   legato?: StyleLegato;
//   mapped?: StyleMapped[];
//   pos?: StylePositions;
//   restNoise?: true, // want to integrate it into inst..
//   scaleX?: StyleScaleX;
//   slide?: StyleSlide;
//   staccato?: StyleStaccato;
//   step?: StyleStep;
//   stroke?: StyleStroke; 
//   strum?: StyleStrum;
//   turn?: {
//     style: StyleTurn,
//     /** group -1 is single */
//     group: number
//     /** group final mark */
//     groupFinal?: true;
//   };
//   until?: UntilNext,
//   velocity?: number;
//   velocityPerBows?: NumberOrUfd[];
// }
