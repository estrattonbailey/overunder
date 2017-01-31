import overunder from '../package/index.js'

const scroller = overunder.scroll(1000, 2000, {watchResize: true})

window.scroller = scroller

scroller.on('under', () => console.log('under'))
scroller.on('between', () => console.log('between'))
scroller.on('over', () => console.log('over'))
