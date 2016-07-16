# Overunder
A tiny helper that let's you know when you're over or under a specified scroll position or viewport width.

## Usage 
Create an instance, attach listeners, and then initiate it to listen for events `above`, `below` or `between` user specified values.

## API
### overunder.scroll(delta[, range, options])
### overunder.resize(delta[, range, options])

## Parameters
#### `delta`
First threshold value to watch. You can also pass an DOM node and Overunder will calculate its offset value.
#### `range` - optional
Second threshold value to watch. Just like `delta`, you can pass a DOM node.

## Options
There are a few configuration options you can override.
```javascript
const options = {
  context: window,
  enterBottom: false,
  watchResize: false
}
```
#### `options.context` - optional, works with `resize()` only currently
Watch a specific element's width change instead of the window.
#### `options.enterBottom` - optional
Fire events when threshold enters the bottom of the screen. Defaults to `false` - fires events when threshold reaches top of screen.
#### `options.watchResize` - optional
On resize, recalculate the positions of `delta` and `range` and update positioning to fire events. **Don't enable this with `resize()`, only use with `scroll()`**.

```javascript
// create an instance
const anchor = document.getElementById('anchor')
const scroller = overunder.scroll(1000, anchor, { watchResize: true })

// attach listeners
scroller.on('under', () => {
  // under 1000px
})
scroller.on('between', () => {
  // above 1000px and below anchor offset top
})
scroller.on('over', () => {
  // over anchor offset top
})

// initiate instance, check scroll position
scroller.init().update()
```
```javascript
// resize example
const resizer = overunder.resize(1200)

resizer.on('over', () => {
  // large screens
})

const element = overunder.resize(500, document.getElementById('elementQuery'))

element.on('under', () => {
  // element is less than 500px wide
})
```

## Create an instance
Overunder returns an object with useful methods attached. It also does not start listening to scroll and resize events until you tell it to. Also, **be sure to attach listeners before you run `.init()`.**

```javascript
const scroller = overunder.scroll(1000)
```
### instance.init()
Initiate instance to start listening to scroll/resize events.

### instance.update()
Check the current scroll position and fire relevant events.

### instance.destroy()
Destroy scroll/resize handlers on the instance.

## Events
Thanks to the lovely [knot.js](https://github.com/callmecavs/knot.js) library, overunder is also an event emitter.

### instance.on(event, handler)
Listen for events (either 'over' or 'under') and run a handler function on each event.

### instance.once(event, handler)
Listen for a single event and fire a handler function.

### instance.off(event[, handler])
Remove listeners for given event and/or handler function.

### instance.emit(event[, arguments])
This is used internally, but if you want to use it externally, go for it.

* * *
MIT
