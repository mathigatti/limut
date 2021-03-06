'use strict';
define(function (require) {
  let system = require('play/system');
  let scale = require('music/scale');
  let envelope = require('play/full-envelope')
  let effects = require('play/effects')
  let pitchEffects = require('play/pitch-effects')
  let param = require('player/default-param')

  return (params) => {
    let degree = parseInt(params.sound) + param(params.add, 0)
    if (isNaN(degree)) { return }
    let freq = scale.degreeToFreq(degree, param(params.oct, 4), params.scale)
    let detuneSemis = param(params.detune, 0.1)

    let vca = envelope(params, 0.02)
    let out = effects(params, vca)
    system.mix(out)

    let pitch = pitchEffects(params)
    let vcos = [0, 0.7, 1].map(lerp => {
      let vco = system.audio.createOscillator()
      vco.type = 'sawtooth';
      vco.frequency.value = freq * Math.pow(2, lerp * detuneSemis/12)
      pitch.connect(vco.detune)
      return vco
    })
    vcos.forEach(vco => vco.connect(vca))
    vcos.forEach(vco => vco.start(params.time))
    vcos.forEach(vco => vco.stop(params.endTime))
    system.disconnect(params, vcos.concat(vca,out))
  }
});
