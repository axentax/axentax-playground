import * as JSSynth from 'js-synthesizer';
import { PlatformConfiguration } from '../settings';

export class XSynthInitializer {

  static async init(sf2FilePath: string) {
    const ac = new AudioContext();

    const promiseSFont = loadSFont(sf2FilePath);

    await ac.audioWorklet.addModule(PlatformConfiguration.assetsPath + '/js/libfluidsynth-2.3.0.js');
    await ac.audioWorklet.addModule(PlatformConfiguration.assetsPath + '/js/js-synthesizer.worklet.js');

    const synth = new JSSynth.AudioWorkletNodeSynthesizer() as JSSynth.Synthesizer;

    synth.init(ac.sampleRate);

    const node = synth.createAudioNode(ac); // setting渡しても適用されない
    node.connect(ac.destination);

    const sFontBin = await promiseSFont;

    // Load SoundFont data to the synthesizer
    await synth.loadSFont(sFontBin);

    return synth;
  }

}

function loadSFont(sf2FilePath: string) {
  const buff = loadBinary(sf2FilePath); // /assets/data/TimGM6mb_slim2.sf2
  return buff;
}

async function loadBinary(url: string) {
  const resp = await fetch(url);
  return await resp.arrayBuffer();
}