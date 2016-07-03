import knot from 'knot.js'

const OVER = 'over' 
const UNDER = 'under' 

/**
 * Compare a variable value i.e. scrollY with
 * the user-passed delta value.
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {integer} compare window.scrollY/outerWidth
 * @param {boolean} update Force an update of this.position
 */
const check = function(delta, compare, update = false){
  if (compare >= delta && this.position !== OVER){
    this.position = OVER
    this.emit(this.position)
  } else if (compare < delta && this.position === OVER) {
    this.position = UNDER
    this.emit(this.position)
  }

  if (update){
    this.position = compare >= delta ? OVER : UNDER
    this.emit(this.position)
  }
}

/**
 * Namespace for scroll/resize handlers
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {boolean} update Force an update of this.position
 */
const watch = {
  scroll: function(delta, update){
    check.call(this, delta, window.scrollY, update)
  },
  resize: function(delta, update){
    check.call(this, delta, window.outerWidth, update)
  }
}

/**
 * Public prototype methods that will be attached
 * to the return value of create()
 */
const proto = {
  update: function(){
    watch[this.type].call(this, this.delta, true)
    return this
  },
  init: function(){
    this.handler = watch[this.type].bind(this, this.delta, false)
    window.addEventListener(this.type, this.handler)
    return this
  },
  destroy: function(){
    window.removeEventListener(this.type, this.handler)
    this.off(OVER)
    this.off(UNDER)
  }
}

/**
 * Create instance with user-passed
 * values and prototypes
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {string} type Either scroll or resize
 */
const create = (delta, type) => {
  return Object.create(knot(proto), {
    type: {
      value: type 
    },
    delta: {
      value: delta
    },
    position: {
      value: UNDER,
      writable: true
    }
  })
}

/**
 * @param {integer} delta Scroll/resize limit in pixels
 */
export default {
  scroll: (delta) => {
    return create(delta, 'scroll')  
  },
  resize: (delta) => {
    return create(delta, 'resize')  
  }
}
