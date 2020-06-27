define((require) => {

  let evalParam = (value, def) => {
    let result = eval(value)
    if (result === null || result === undefined) { return def }
    return result
  }

  // TESTS //

  let assert = (expected, actual) => {
    let x = JSON.stringify(expected, (k,v) => (typeof v == 'number') ? (v+0.0001).toFixed(2) : v)
    let a = JSON.stringify(actual, (k,v) => (typeof v == 'number') ? (v+0.0001).toFixed(2) : v)
    if (x !== a) { console.trace(`Assertion failed.\n>>Expected:\n  ${x}\n>>Actual:\n  ${a}`) }
  }

  assert(1, evalParam(1, 0))
  assert(1, evalParam('1', 0))
  assert(0, evalParam(null, 0))
  assert(0, evalParam(undefined, 0))
  assert(1/2, evalParam('1/2', 0))
  assert(3, evalParam(' 1 + 2 ', 0))
  assert(0, evalParam(0, 1))
  assert(0, evalParam('0', 1))
  assert(0, evalParam('1-1', 1))

  console.log('Eval param tests complete')

  return evalParam
})
