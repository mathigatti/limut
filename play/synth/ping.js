'use strict';
define(function (require) {
  let system = require('play/system');
  let scale = require('music/scale');
  let envelope = require('play/no-sus-envelope')
  let effects = require('play/effects')
  let pitchEffects = require('play/pitch-effects')
  let param = require('player/default-param')

  return (params) => {
    let degree = parseInt(params.sound) + param(params.add, 0)
    if (isNaN(degree)) { return }
    let freq = scale.degreeToFreq(degree, param(params.oct, 5), params.scale)

    let vca = envelope(params, 0.04)
    system.mix(effects(params, vca))

    let vco = system.audio.createOscillator()
    vco.type = 'sine'
    vco.frequency.value = freq
    pitchEffects(params).connect(vco.detune)
    vco.connect(vca)
    vco.start(params.time)
    vco.stop(params.endTime)
  }
})
