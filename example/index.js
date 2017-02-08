import overunder from '../package/index.js'

const scroller = overunder.scroll(document.getElementById('target'), {
  watchResize: true,
})

window.scroller = scroller

scroller.on('under', () => console.log('under'))
scroller.on('between', () => console.log('between'))
scroller.on('over', () => console.log('over'))

scroller.update({
  offset: 200,
}).check()

const viewport = window.innerHeight
// window.addEventListener('scroll', e => console.log(window.scrollY))
