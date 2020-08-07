'use strict'
define(function(require) {
  try { if (!AudioContext) { throw 1; } } catch(e) { document.body.innerHTML = 'Web Audio not supported in this browser!'; return; }

  require('predefined-vars')
  let system = require('play/system')
  let drawSystem = require('draw/system')
  let metronome = require('metronome')
  let scale = require('music/scale')
  let parseLine = require('parse-line')
  let players = require('player/players')

  // accordions
  window.toggleAccordion = (id) => {
    document.getElementById(id).classList.toggle('closed')
  }

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

  // Scale ui
  let scaleReadout = document.getElementById('scale-readout')
  window.scaleChange = function (s) {
    window.scaleChanged(scale.set(s))
  }
  window.scaleChanged = function (s) {
    scaleReadout.innerText = s
  }
  window.scaleChanged(scale.current)

  // console ui
  let cons = document.getElementById('console')
  let consoleOut = (str) => {
    cons.value += '\n'+str
    cons.scrollTop = cons.scrollHeight
  }
  consoleOut('\n> Welcome to Limut')

  // Play/stop/comment ui
  let codeTextArea = document.getElementById('code')
  let ctrlCode = (event, keys) => {
    if (event.isComposing || event.keyCode === 229) { return false }
    return (event.ctrlKey && (keys.includes(event.keyCode) || keys.includes(event.key)))
  }
  document.addEventListener("keydown", event => {
    if (ctrlCode(event, ['.'])) { window.stop() }
  })
  codeTextArea.addEventListener("keydown", event => {
    if (ctrlCode(event, [10, 13])) { window.go() }
  })
  codeTextArea.addEventListener("keydown", event => {
    if (ctrlCode(event, ['/'])) { window.comment() }
  })
  window.stop = () => {
    system.resume()
    players.instances = {}
    consoleOut('\n> Stop all players')
  }
  window.go = () => {
    let selStart = codeTextArea.selectionStart
    let selEnd = codeTextArea.selectionEnd
    let selDir = codeTextArea.selectionDirection
    codeTextArea.focus()
    codeTextArea.setSelectionRange(0, 1e10)
    system.resume()
    players.instances = {}
    codeTextArea.value.split('\n')
    .map((l,i) => {return{line:l.trim(), num:i}})
    .map(({line,num}) => {return{line:line.replace(/\/\/.*/, ''),num:num}})
    .filter(({line}) => line != '')
    .map(({line,num}) => {
      try {
        parseLine(line)
        consoleOut('>'+line)
      } catch (e) {
        let st = e.stack ? '\n'+e.stack.split('\n')[0] : ''
        consoleOut('Error on line '+(num+1)+': ' + e + st)
      }
    })
    setTimeout(() => codeTextArea.setSelectionRange(selStart, selEnd, selDir), 100)
  }
  window.comment = () => {
    let selStart = codeTextArea.selectionStart
    let selEnd = codeTextArea.selectionEnd
    let selDir = codeTextArea.selectionDirection
    let code = codeTextArea.value
    let lineStart = codeTextArea.value.lastIndexOf('\n', selStart - 1) + 1
    if (code.slice(lineStart, lineStart+3) == '// ') {
      codeTextArea.value = code.slice(0, lineStart) + code.slice(lineStart + 3)
      codeTextArea.focus()
      codeTextArea.setSelectionRange(selStart - 3, selEnd - 3, selDir)
    } else {
      codeTextArea.value = code.slice(0, lineStart) + "// " + code.slice(lineStart)
      codeTextArea.focus()
      codeTextArea.setSelectionRange(selStart + 3, selEnd + 3, selDir)
    }
  }

  // indicator helpers
  let to255 = (x) => Math.min(Math.max(Math.floor(x*256), 0), 255)
  let compressorColor = (reduction) => {
    let c = Math.abs(reduction)/3
    return `rgb(${to255(Math.sin(c*1.57))},${to255(Math.cos(c*1.57))},0)`
  }

  // webgl canvas
  var canvas = document.getElementById("canvas")
  let onResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize, false)
  onResize()
  let ctxGl = canvas.getContext("webgl")
  if (!ctxGl) { ctxGl = canvas.getContext("experimental-webgl") }
  if (!ctxGl) { console.error('WebGL not supported!') }

  // Update
  let compressorReadout = document.getElementById('compressor-readout')
  let beatReadout = document.getElementById('beat-readout')
  let beat4Readout = document.getElementById('beat4-readout')
  let beat16Readout = document.getElementById('beat16-readout')
  let beat32Readout = document.getElementById('beat32-readout')
  let tick = (t) => {
    compressorReadout.style.backgroundColor = compressorColor(system.compressorReduction())
    let now = system.timeNow()
    let beat = metronome.update(now)
    if (beat) {
      beatReadout.innerText = beat.count
      beat4Readout.innerText = (beat.count%4 + 1) + '/4'
      beat16Readout.innerText = (beat.count%16 + 1) + '/16'
      beat32Readout.innerText = (beat.count%32 + 1) + '/32'
      for (let playerName of Object.keys(players.instances)) {
        let player = players.instances[playerName]
        if (player !== undefined) {
          try {
            player.play(player.getEventsForBeat(beat))
          } catch (e) {
            let st = e.stack ? '\n'+e.stack.split('\n')[0] : ''
            consoleOut('Run Error from player '+playerName+': ' + e + st)
          }
        }
      }
    }
    if (ctxGl) {
      try {
        drawSystem.frameStart(now, metronome.beatTime(now), ctxGl, canvas.width, canvas.height)
      } catch (e) {
        let st = e.stack ? '\n'+e.stack.split('\n')[0] : ''
        consoleOut('Run Error from drawing: ' + e + st)
      }
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
