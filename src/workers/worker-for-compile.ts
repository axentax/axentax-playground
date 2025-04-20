/* eslint @typescript-eslint/no-explicit-any: off */
import { Conductor } from 'axentax-compiler';

const chordDic = new Map();
const mapSeed = {};

self.addEventListener('message', (event) => {
  const id = event.data.id;
  const hasStyleCompile = event.data.hasStyleCompile;
  const hasMidiCompile = event.data.hasMidiCompile;
  const data = event.data.syntax;

  convertToObj(hasStyleCompile, hasMidiCompile, data).then(res => {
    res.id = id;
    self.postMessage(res)
  });
});

async function convertToObj(hasStyleCompile: any, hasMidiCompile: any, syntax: any) {
  // return Conductor.convertToObj(hasStyleCompile, data, new Map(), {});
  // console.log('dic>>', chordDic.size, Object.keys(mapSeed).length)
  return Conductor.convertToObj(
    hasStyleCompile,
    hasMidiCompile,
    syntax,
    [
      {
        name: 'compose',
        dualIdRestrictions: [0]
      },
      {
        name: '/compose',
        dualIdRestrictions: [0]
      }
    ],
    chordDic,
    mapSeed
  );
}
