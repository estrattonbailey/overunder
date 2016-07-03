# Overunder
A tiny helper that let's you know when you're over or under a specified scroll position or viewport width.

## Usage 
Overunder emits events above and below a specified value – 'under' and 'over', respectively.

```javascript
const scroller = overunder.scroll(1000)

scroller.on('under', () => {
  // under 1000px
})
scroller.on('over', () => {
  // over 1000px
})

scroller.init().update()
```

### overunder.scroll(position)
Creates a scroll listener for a pixel value, `position`.

### overunder.resize(position)
Creates a resize listener for a pixel value, `position`.

## Create an instance
**Assign overunder to a variable.**
```javascript
const scroller = overunder.scroll(1000)
```
### overunder.init()
Initiate instance to start listening to scroll/resize events.

### overunder.update()
Check the current scroll position and fire relevant events.

### overunder.destroy()
Destroy scroll/resize handlers on the instance.

## Events
Thanks to the lovely [knot.js](https://github.com/callmecavs/knot.js) library, overunder is also an event emitter.

### overunder.on(event, handler)
Listen for events (either 'over' or 'under') and run a handler function on each event.

### overunder.once(event, handler)
Listen for a single event and fire a handler function.

### overunder.off(event[, handler])
Remove listeners for given event and/or handler function.

### overunder.emit(event[, arguments])
This is used internally, but if you want to use it externally, go for it.
