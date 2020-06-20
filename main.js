define(function(require) {
  try { if (!AudioContext) { throw 1; } } catch(e) { document.body.innerHTML = 'Web Audio not supported in this browser!'; return; }

  let system = require('play/system');
  let metronome = require('metronome');
  let standardPlayer = require('player/standard')
  let percussion = require('play/percussion')
  let play = require('play/play')
  let dsaw = require('play/dsaw')

  // Players
  let nullPlayer = () => {}
  let players = {
    // stop
    none: nullPlayer,
    stop: nullPlayer,
    '!': nullPlayer,
    // instruments
    drums: standardPlayer(percussion.play),
    play: standardPlayer(play),
    dsaw: standardPlayer(dsaw),
    dsawbass: standardPlayer(e => { e.oct=e.oct||2; e.amp=(e.amp||1)*2; e.detune=e.detune||0.25; dsaw(e) }),
  };
  let vars = {
    bpm: (command) => metronome.bpm(eval(command)),
    mainamp: (command) => window.mainAmpChange(eval(command)),
    mainreverb: (command) => window.mainReverbChange(eval(command)),
  }
  let playerInstances = {};

  // Bpm ui
  let bpmReadout = document.getElementById('bpm-readout')
  window.bpmChanged = function (bpm) {
    bpmReadout.innerText = bpm.toFixed(1)
  }
  window.bpmChanged(metronome.bpm())

  // Main amp UI
  let mainAmpReadout = document.getElementById('main-amp-readout')
  let mainAmpInput = document.getElementById('main-amp-slider')
  window.mainAmpChange = (amp) => {
    window.mainAmpChanged(system.mainAmp(amp))
  }
  window.mainAmpChanged = (mainAmp) => {
    mainAmpReadout.innerText = mainAmp.toFixed(2)
    mainAmpInput.value = mainAmp*100
  }
  window.mainAmpChanged(system.mainAmp())

  // Main reverb UI
  let mainReverbReadout = document.getElementById('main-reverb-readout')
  window.mainReverbChange = (reverb) => {
    window.mainReverbChanged(system.mainReverb(reverb))
  }
  window.mainReverbChanged = (mainReverb) => {
    mainReverbReadout.innerText = mainReverb.toFixed(2)
  }
  window.mainReverbChanged(system.mainReverb())

  // Play/stop ui
  let codeTextArea = document.getElementById('code')
  document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) { return; }
    if (event.key == '.' && event.ctrlKey) {
      window.stop()
    }
  })
  codeTextArea.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) { return; }
    if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
      window.go()
    }
  });
  window.stop = () => {
    system.resume()
    playerInstances = {};
  }
  window.go = () => {
    system.resume()
    codeTextArea.value.split('\n')
    .map(l => l.trim())
    .map(line => line.replace(/\/\/.*/, ''))
    .filter(l => l != '')
    .map(line => {
      let parts = line.split(/(\s+)/).map(p => p.trim()).filter(p => p != '')
      let playerId = parts[0].trim()
      if (playerId) {
        let playerName = parts[1].trim()
        if (playerName) {
          let command  = parts.slice(2).join('').trim()
          if (playerName == '=') {
            vars[playerId.toLowerCase()](command)
          } else {
            playerInstances[playerId] = players[playerName.toLowerCase()](command)
          }
        } else {
          delete playerInstances[playerId]
        }
      }
    })
  }

  // Update
  let tick = function () {
    let beat = metronome.update(system.timeNow());
    if (beat) {
      for (let player of Object.values(playerInstances)) {
        if (typeof player === 'function') { player(beat) }
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
