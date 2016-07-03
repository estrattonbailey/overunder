# Overunder
A tiny helper that let's you know when you're over or under a specified scroll position or viewport width.

## Usage 
Create an instance, attach listeners, and then initiate it to listen for events above and below a specified value – 'under' and 'over', respectively.

### overunder.scroll(position)
Creates a scroll listener for a pixel value, `position`, and returns an instance object.

### overunder.resize(position)
Creates a resize listener for a pixel value, `position`, and returns an instance object.

```javascript
// create an instance
const scroller = overunder.scroll(1000)

// attach listeners
scroller.on('under', () => {
  // under 1000px
})
scroller.on('over', () => {
  // over 1000px
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
