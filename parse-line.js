'use strict'
define((require) => {
  let players = require('player/players')
  let playerTypes = require('player/player-types')
  let parseExpression = require('player/parse-expression')
  let metronome = require('metronome')
  let vars = require('vars')

  let mainVars = {
    bpm: (command) => metronome.bpm(eval(parseExpression(command))),
    scale: (command) => window.scaleChange(command.toLowerCase()),
    'main.amp': (command) => window.mainAmpChange(eval(parseExpression(command))),
    'main.reverb': (command) => window.mainReverbChange(eval(parseExpression(command))),
  }

  let parseLine = (line) => {
    line = line.trim()
    if (!line) { return }
    if (line.startsWith('//')) { return }
    let [k,v] = line.split('=').map(p => p.trim()).filter(p => p != '')
    k = k.toLowerCase()
    if (k.match(/^[a-z][a-z0-9_\.]*$/) && !!v) {
      if (typeof mainVars[k] == 'function') {
        mainVars[k](v)
      } else {
        v = parseExpression(v)
        vars[k] = v
      }
      return
    }
    let parts = line.split(/(\s+)/).map(p => p.trim()).filter(p => p != '')
    let playerId = parts[0].toLowerCase()
    if (playerId) {
      let playerName = parts[1]
      if (!playerName) { throw 'Missing player name' }
      if (playerName) {
        let command  = parts.slice(2).join('').trim()
        if (!command) { throw 'Player "'+playerName+'" Missing pattern/params' }
        let player = playerTypes[playerName.toLowerCase()]
        if (!player) { throw 'Player "'+playerName+'" not found' }
        players.instances[playerId] = player(command)
      } else {
        delete players.instances[playerId]
      }
    }
  }

  // TESTS //

  let assert = (expected, actual) => {
    let x = JSON.stringify(expected, (k,v) => (typeof v == 'number') ? (v+0.0001).toFixed(2) : v)
    let a = JSON.stringify(actual, (k,v) => (typeof v == 'number') ? (v+0.0001).toFixed(2) : v)
    if (x !== a) { console.trace(`Assertion failed.\n>>Expected:\n  ${x}\n>>Actual:\n  ${a}`) }
  }
  let assertThrows = (expected, code) => {
    let got
    try {code()}
    catch (e) { if (e.includes(expected)) {got=true} else {console.trace(`Assertion failed.\n>>Expected throw: ${expected}\n>>Actual: ${e}`)} }
    finally { if (!got) console.trace(`Assertion failed.\n>>Expected throw: ${expected}\n>>Actual: none` ) }
  }

  parseLine('')

  parseLine('foo=1+1')
  assert(2, vars.foo)
  delete vars.foo

  parseLine('//foo=1+1')
  assert(undefined, vars.foo)

  parseLine('// foo=1+1')
  assert(undefined, vars.foo)

  parseLine('  //foo=1+1  ')
  assert(undefined, vars.foo)

  parseLine('foo=1//+1')
  assert(1, vars.foo)
  delete vars.foo

  parseLine('foo=1 // +1')
  assert(1, vars.foo)
  delete vars.foo

  parseLine("foo='http://a.com/Bc.mp3'")
  assert('http://a.com/Bc.mp3', vars.foo)
  delete vars.foo

  parseLine("foo='http://a.com/Bc.mp3'// BLAH")
  assert('http://a.com/Bc.mp3', vars.foo)
  delete vars.foo

  parseLine(' \tfoo = 1 + 2 ')
  assert(3, vars.foo)
  delete vars.foo

  parseLine('p play xo')
  assert('function', typeof players.instances.p.getEventsForBeat)
  assert('function', typeof players.instances.p.play)
  delete players.instances.p

  assertThrows('Missing player name', ()=>parseLine('p'))
  assertThrows('Missing pattern/params', ()=>parseLine('p play'))
  assertThrows('Player "INVALID" not found', ()=>parseLine('p INVALID xo'))

  console.log('Parse line tests complete')

  return parseLine
})
