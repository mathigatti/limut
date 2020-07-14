'use strict';
define(function (require) {
  let system = require('play/system');
  let scale = require('music/scale');
  let envelope = require('play/pad-envelope')
  let effects = require('play/effects')
  let param = require('player/default-param')
  let fm = require('play/fm')

  return (params) => {
    let degree = parseInt(params.sound) + param(params.add, 0)
    if (isNaN(degree)) { return }
    let freq = scale.degreeToFreq(degree, param(params.oct, 5))
    let detuneSemis = param(params.detune, 0.1)

    let vca = envelope(params, 0.01)
    system.mix(effects(params, vca))

    let op4 = fm.op(freq, params)
    op4.connect(vca)

    let op3 = fm.op(freq*7, params, 'triangle')
    fm.connect(op3, op4, fm.flatEnv(300*freq/261.6))

    let op2 = fm.op(freq, params, 'triangle')
    fm.connect(op2, op3, fm.flatEnv(700*freq/261.6))

    let op1 = fm.op(freq*1.01, params, 'triangle')
    fm.connect(op1, op4, fm.flatEnv(200*freq/261.6))
  }
});
