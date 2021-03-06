'use strict';
define(function (require) {
  let system = require('play/system');
  let {getBuffer} = require('play/samples')
  let effects = require('play/effects')
  let param = require('player/default-param')
  let scale = require('music/scale');
  let envelope = require('play/no-sus-envelope')

  return (params) => {
    let degree = parseInt(params.sound) + param(params.add, 0)
    if (isNaN(degree)) { return }
    let freq = scale.degreeToFreq(degree, param(params.oct, 4), params.scale)
    let source = system.audio.createBufferSource()
    source.buffer = getBuffer(param(params.sample, 'sample/salamander/C4v8.mp3'))
    let samplePitch = param(params.samplepitch, 261.6256)
    source.playbackRate.value = freq / samplePitch
    params.endTime = params.time + param(params.dur, 0.1)*params.beat.duration

    let vca = envelope(params, 0.25)
    source.connect(vca)
    system.mix(effects(params, vca))

    source.start(params.time)
    source.stop(params.endTime)
  }
});
