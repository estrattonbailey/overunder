import test from 'ava'
import jsdom from 'jsdom-global'
import overunder from '../dist/overunder.js'

jsdom('<html></html>')

test('scroll delta', t => {
  t.plan(1)

  let delta = 500
  let instance = overunder.scroll(delta)

  instance.delta === delta ? t.pass() : t.fail()
})

test('resize delta', t => {
  t.plan(1)

  let delta = 500
  let instance = overunder.resize(delta)

  instance.delta === delta ? t.pass() : t.fail()
})

test('scroll delta + range', t => {
  t.plan(2)

  let delta = 500
  let range = 1000
  let instance = overunder.scroll(delta, range)

  t.is(instance.delta, delta)
  t.is(instance.range, range)
})

test('resize delta + range', t => {
  t.plan(2)

  let delta = 500
  let range = 1000
  let instance = overunder.resize(delta, range)

  t.is(instance.delta, delta)
  t.is(instance.range, range)
})

// test('update delta', t => {
//   t.plan(1)

//   let delta = 500
//   let update = 1000
//   let instance = overunder.resize(delta)

//   instance.init()

//   instance.update(update)

//   t.is(instance.delta, update)
// })

// test('update range', t => {
//   t.plan(1)

//   let delta = 500
//   let range = 1000
//   let update = 1500
//   let instance = overunder.resize(delta, range)

//   instance.init()

//   instance.update(null, update)

//   t.is(instance.range, update)
// })

test('initial options', t => {
  t.plan(1)

  let options = {
    context: document.body,
    watchResize: true, 
    enterBottom: true,
    offset: 100,
    negativeOffset: 100
  }
  let instance = overunder.scroll(500, options)

  t.deepEqual(instance.options, options)
})

// test('update options', t => {
//   t.plan(1)

//   let options = {
//     context: document.body,
//     watchResize: true, 
//     enterBottom: true,
//     offset: 100,
//     negativeOffset: 100
//   }
//   let update = {
//     offset: 200
//   }
//   let instance = overunder.scroll(500, options)

//   instance.init()

//   instance.update(update)

//   t.is(instance.options.offset, update.offset)
// })
