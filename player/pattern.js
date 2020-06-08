define(function(require) {

  let parsePattern = (pattern, params) => {
    let steps = pattern.split('')
    let dur = eval(params.dur) || 1
    events = [[]]
    let time = 0
    steps.forEach((step, idx) => {
      let value = steps[idx]
      event = Object.assign({value:value, time:time}, params)
      events[events.length-1].push(event)
      time += dur
      if (time >= 0.999) {
        time -= 1
        events.push([])
      }
    })
    return events.filter(x => x.length>0)
  }

  // TESTS //

  let assert = (expected, actual) => {
    let x = JSON.stringify(expected)
    let a = JSON.stringify(actual)
    if (x !== a) { throw(`Assertion failed.\n  Expected: ${x}\n  Actual: ${a}`) }
  }

  assert([], parsePattern('', {}))

  assert([[{value:'x',time:0}]], parsePattern('x', {}))

  assert([[{value:'x',time:0}],[{value:'o',time:0}]], parsePattern('xo', {}))

  assert([[{value:'x',time:0,dur:1/2},{value:'o',time:1/2,dur:1/2}]], parsePattern('xo', {dur:1/2}))

  //assert([[{value:'-',time:0,dur:1/2},{value:'-',time:1/2,dur:1/2}]], parsePattern('-', {dur:1/2}))

  //assert([[{value:'x',time:0},{value:'o',time:1/2}]], parsePattern('[xo]', {}))

  //assert([[{value:'x',time:0,dur:1/2},{value:'o',time:1/4,dur:1/2},{value:'x',time:1/2,dur:1/2},{value:'o',time:3/4,dur:1/2}]], parsePattern('[xo]', {dur:1/2}))

  //assert([[{value:'x',time:0},{value:'-',time:1/3},{value:'o',time:2/3}]], parsePattern('[x-o]', {}))

  //assert([[{value:'x',time:0},{value:'-',time:1/2},{value:'o',time:3/4}]], parsePattern('[x[-o]]', {}))

  //assert([[{value:'x',time:0}],[{value:'.',time:0}],[{value:'o',time:0}],[{value:'.',time:0}]], parsePattern('(xo).', {}))

  //etc

  console.log("Pattern tests complete")

  return parsePattern
});
