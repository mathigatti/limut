'use strict';
define(function(require) {
  let parseExpression = require('player/parse-expression')

  let parseName = (state) => {
    let name = ''
    let char
    while (char = state.str.charAt(state.idx)) {
      if (char == '=') {
        state.idx += 1
        return name
      } else {
        name = name+char
        state.idx += 1
      }
    }
    return null
  }

  let brackets = {
    '[': ']',
    '(': ')',
    '{': '}',
    '<': '>',
  }

  let parseValue = (state) => {
    let value = ''
    let char
    while (char = state.str.charAt(state.idx)) {
      if (brackets[char]) {
        value = value+char
        state.bracketStack.push(brackets[char])
        state.idx += 1
      } else if (char == state.bracketStack[state.bracketStack.length-1]) {
        value = value+char
        state.bracketStack.pop()
        state.idx += 1
      } else if (char == ',' && state.bracketStack.length == 0) {
        state.idx += 1
        return value
      } else {
        value = value+char
        state.idx += 1
      }
    }
    return value
  }

  let parseParam = (state) => {
    let name = parseName(state)
    let value = parseValue(state)
    if (name) {
      if (name.includes('//')) { return false }
      state.params[name.toLowerCase().trim()] = parseExpression(value.trim())
      if (value.trim().endsWith('//')) { return false }
      return true
    }
    return false
  }

  let parseParams = (paramsStr) => {
    let state = {
      str: paramsStr,
      idx: 0,
      params: {},
      bracketStack: [],
    }
    while (parseParam(state)) {}
    return state.params
  }

  // TESTS //

  let assert = (expected, actual) => {
    let x = JSON.stringify(expected)
    let a = JSON.stringify(actual)
    if (x !== a) { console.trace(`Assertion failed.\n>>Expected:\n  ${x}\n>>Actual:\n  ${a}`) }
  }

  assert({}, parseParams(''))
  assert({dur:1}, parseParams('dur=1'))
  assert({dur:1}, parseParams('Dur=1'))
  assert({dur:1, oct:4}, parseParams('dur=1, oct=4'))
  assert({dur:4, oct:5, decay:2, att:2}, parseParams('dur=4, oct=5, decay=2, att=2'))
  assert({dur:1/2}, parseParams('dur=1/2'))
  assert({dur:[]}, parseParams('dur=[]'))
  assert({dur:[1]}, parseParams('dur=[1]'))
  assert({dur:[1,1]}, parseParams('dur=[1,1]'))
  assert({dur:1, oct:4}, parseParams('dur=1,oct=4'))
  assert({dur:[1,1]}, parseParams(' dur = [ 1 , 1 ] '))
  assert({dur:[1,2], oct:[3, 4]}, parseParams('dur=[1, 2],oct=[3, 4]'))
  assert({dur:[[1,1],[[2],3]], oct:4}, parseParams('dur=[[1,1],[[2],3]],oct=4'))
  assert({t:['a','b']}, parseParams("t=['a','b']"))
  assert({s:'abc'}, parseParams("s='abc'"))
  assert({s:'http://a.com/Bc.mp3'}, parseParams("s='http://a.com/Bc.mp3'"))
  assert({}, parseParams("//s='abc'"))
  assert({}, parseParams("s//='abc'"))
  assert({}, parseParams("s=//'abc'"))
  assert({a:1}, parseParams("a=1,//s='abc'"))
  assert({a:1}, parseParams("a=1//,s='abc'"))
  assert({a:1}, parseParams("a=1, //s='abc'"))

  console.log("Params tests complete")

  return parseParams
});
