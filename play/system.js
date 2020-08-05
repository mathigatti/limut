'use strict';
define(function (require) {

var system = {
  audio: new AudioContext(),
};

system.resume = () => system.audio.resume()

system.timeNow = function () {
  return system.audio.currentTime;
};

let globalBaseGain = 0.7
system.vcaMainAmp = system.audio.createGain()
system.vcaMainAmp.gain.value = globalBaseGain
system.mainAmp = (amp) => {
  if (typeof amp == 'number') {
    system.vcaMainAmp.gain.value = amp*globalBaseGain
  }
  return system.vcaMainAmp.gain.value/globalBaseGain
}

system.compressorReduction = () => {
  if (!system.compressor) { return 0 }
  return system.compressor.reduction
}

system.analyser = system.audio.createAnalyser()
system.analyser.fftSize = 512
system.analyser.smoothingTimeConstant = 0.4
let analyserBufferLength = system.analyser.frequencyBinCount
let analyserData = new Uint8Array(analyserBufferLength)
let chunk = (data, reducer, init) => {
  return data.reduce((a,b) => reducer(a,b), init) / 255
}
system.spectrum = () => {
  system.analyser.getByteFrequencyData(analyserData)
  return [
    chunk(analyserData.slice(0,4), Math.min, 1e6),
    chunk(analyserData.slice(4,8), Math.min, 1e6),
    chunk(analyserData.slice(8,12), (a,b)=>a+b, 0)/4,
    chunk(analyserData.slice(12), Math.max,0),
  ]
}

system.mix = function (node) {
  node.connect(system.vcaMainAmp)
}

var _initReverb = function () {
  system.reverb = system.audio.createConvolver();
  var seconds = 0.5;
  var decay = 5;
  var rate = system.audio.sampleRate;
  var length = rate * seconds;
  var impulse = system.audio.createBuffer(2, length, rate);
  var impulseL = impulse.getChannelData(0);
  var impulseR = impulse.getChannelData(1);
  for (var i = 0; i < length; i++) {
    impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  }
  system.reverb.buffer = impulse;
};
_initReverb();
system.mainReverb = (reverb) => {
  if (typeof reverb == 'number') {
    system.vcaReverb.gain.value = reverb
  }
  return system.vcaReverb.gain.value
}
system.vcaReverb = system.audio.createGain()
system.vcaReverb.gain.value = 1
system.reverb.connect(system.vcaReverb)
system.compressor = system.audio.createDynamicsCompressor()
system.vcaReverb.connect(system.compressor)
system.vcaMainAmp.connect(system.reverb)
system.vcaMainAmp.connect(system.compressor)
system.compressor.connect(system.audio.destination)
system.compressor.connect(system.analyser)

return system;
});
