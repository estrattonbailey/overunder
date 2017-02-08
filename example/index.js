import overunder from '../package/index.js'

const scroller = overunder.scroll(document.getElementById('target'), {
  watchResize: true,
})

window.scroller = scroller

scroller.on('under', () => console.log('under'))
scroller.on('between', () => console.log('between'))
scroller.on('over', () => console.log('over'))

scroller.update()

setTimeout(() => {
  scroller.update({paused: true})
  setTimeout(() => {
    scroller.update({paused: false})
  }, 5000)
}, 5000)

const viewport = window.innerHeight
// window.addEventListener('scroll', e => console.log(window.scrollY))
