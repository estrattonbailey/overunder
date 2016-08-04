# overunder  [![npm](https://img.shields.io/npm/v/overunder.svg?maxAge=2592000)](https://www.npmjs.com/package/overunder)
A small waypoint library that emits events when you scroll to a specific element(s), or resize to a specified width.

Use overunder for sticky elements, lazy loading, [element queries](https://www.sitepoint.com/beyond-media-queries-time-get-elemental/), etc.

## Install 
```bash
npm i overunder --save
```

## Usage
#### Create An Instance
Create an instance with two waypoints.
```javascript
import overunder from 'overunder'

const endWaypoint = document.getElementById('anchor')

const scroller = overunder.scroll(200, endWaypoint, {watchResize: true})

scroller.on('under' () => {
  // under 200px
})

scroller.on('between' () => {
  // between 200px and endWaypoint offset top
})

scroller.on('over' () => {
  // over endWaypoint offset top
})

// Start watching scroll and check position
scroller.init().update()
```
#### Destroy An Instance
Destroy an instance and all handlers.
```javascript
scroller.destroy()
```
#### Update Instance After DOM Change
After a DOM change, like appending elements via AJAX, check scroll position again.
```javascript
scroller.update()
```
If a waypoint changes, or you need to update either of the waypoints, pass them as arguments to the `update()` method. This will also check the position immediately after updating the waypoint value.
```javascript
scroller.update(500)

// Or pass a new element
scroller.update(500, newEndWaypoint)
```

## API 
```javascript
import overunder from 'overunder'
```

### .scroll
```javascript
overunder.scroll(delta, range, options)
```
- delta `string|element` - first waypoint
- range `string|element` - (optional) second waypoint, enables the `between` event
- options `object` - (optional) available properties: `watchResize` `offset` `enterBottom`
 
### .resize
```javascript
overunder.resize(delta, range, options)
```
- delta `string|element` - first waypoint
- range `string|element` - (optional) second waypoint, enables the `between` event
- options `object` - (optional) available properties: `offset` `context`

### .on
Attach event listeners for a event.
```javascript
overunder.on(event, callback)
```

### .off
Remove event listener.
```javascript
const handler = () => {}
overunder.off('over', handler)
```

### .init
Initiate the instance and start watching for resize or scroll events. Returns the instance, allowing you to chain `update()`.
```javascript
overunder.init()
```

### .update
Check position. 
```javascript
overunder.update()
```
Optionally update the waypoints, and then check position.
```javascript
overunder.update(newDelta, newRange)
```
*Currently it's not possible to update only the `range` value independently.*

### .destroy
Destroy the instance and remove all listeners.
```javascript
overunder.destroy()
```

## Options
Options are passed as an object as the second or third parameter of either the `scroll()` or `resize()` methods.

### offset `number` - default: 0
Buffer distance, subtracted from scroll/resize position. Pass a negative number to achieve a positive offset.

### watchResize `boolean` - default: false
Continously checks scroll position on resize. *For `scroll()` instances only.*

### enterBottom `boolean` - default: false
By defaul, overunder fires events when waypoints reach the top of the viewport. Enable this option to fire events when the waypoint enters the bottom of the viewport. *For `scroll()` instances only.*

### context `element` - default: window
Watch a specific element for changes in width. *For `resize()` instances only.*

## Dependencies
- [knot.js:](https://github.com/callmecavs/knot.js) A browser-based event emitter, for tying things together. by [@callmecavs](https://github.com/callmecavs)

## TODO
1. Test `context` option on scroll
2. Enforce options for `scroll` vs `resize` i.e. resize doesn't need `watchResize` option
3. Allow for updating the `range` value independently of the `delta`
4. Pass context to `resize` callback

### MIT License - Please contribute! :)
