define(function(require) {
  try { if (!AudioContext) { throw 1; } } catch(e) { document.body.innerHTML = 'Web Audio not supported in this browser!'; return; }

  let play = require('play/play');
  let metronome = require('metronome');
  let players = {
    drums: require('player/drums')
  };
  let playerInstances = {};

  document.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) { return; }
    if (event.key == '.' && event.ctrlKey) {
      playerInstances = {};
    }
  })

  let textarea = document.getElementById('code')
  textarea.addEventListener("keydown", event => {
    if (event.isComposing || event.keyCode === 229) { return; }
    if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey) {
      textarea.value.split('\n')
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
  });

  let tick = function () {
    let beat = metronome.update(play.timeNow());
    if (beat) {
      for (let player of Object.values(playerInstances)) {
        player(beat)
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});
