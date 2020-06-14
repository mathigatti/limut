define(function(require) {
  try { if (!AudioContext) { throw 1; } } catch(e) { document.body.innerHTML = 'Web Audio not supported in this browser!'; return; }

  let play = require('play/play');
  let metronome = require('metronome');
  let standardPlayer = require('player/standard')
  let percussion = require('play/percussion')
  let dsaw = require('play/dsaw')

  // Players
  let nullPlayer = () => {}
  let players = {
    none: nullPlayer,
    stop: nullPlayer,
    drums: standardPlayer(percussion.play),
    dsaw: standardPlayer(dsaw.play),
    bpm: (command) => metronome.bpm(parseFloat(command)),
  };
  let playerInstances = {};

  // Bpm ui
  let bpmInput = document.getElementById('bpm')
  let bpmReadout = document.getElementById('bpm-readout')
  window.bpmChange = function (ta) {
    metronome.bpm(ta.value)
  }
  window.bpmChanged = function (bpm) {
    bpmInput.value = bpm
    bpmReadout.innerText = bpm.toFixed(1)
  }
  window.bpmChanged(metronome.bpm())

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
    play.resume()
    playerInstances = {};
  }
  window.go = () => {
    play.resume()
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
          playerInstances[playerId] = players[playerName](command)
        } else {
          delete playerInstances[playerId]
        }
      }
    })
  }

  // Update
  let tick = function () {
    let beat = metronome.update(play.timeNow());
    if (beat) {
      for (let player of Object.values(playerInstances)) {
        if (typeof player === 'function') { player(beat) }
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
