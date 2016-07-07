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
const check = function(delta, compare, target, update = false){
  let triggered = false

  if (compare >= delta && this.position !== OVER){
    this.position = OVER
    this.emit(this.position, target)
    triggered = true
  } else if (compare < delta && this.position === OVER) {
    this.position = UNDER
    this.emit(this.position, target)
    triggered = true
  }

  if (update === true && !triggered){
    this.position = compare >= delta ? OVER : UNDER
    this.emit(this.position, target)
  }
}

/**
 * Namespace for scroll/resize handlers
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {boolean} update Force an update of this.position
 */
const watch = {
  scroll(delta, target, update){
    let compare = target.scrollY || target.pageYOffset
    check.call(this, delta, compare, window, update)
  },
  resize(delta, target, update){
    let compare = target.offsetWidth || target.outerWidth
    check.call(this, delta, compare, target, update)
  }
}

/**
 * Public prototype methods that will be attached
 * to the return value of create()
 */
const proto = {
  update(){
    watch[this.type].call(this, this.delta, this.target, true)
    return this
  },
  init(){
    this.handler = watch[this.type].bind(this, this.delta, this.target)
    window.addEventListener(this.type, this.handler)
    return this
  },
  destroy(){
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
const create = (delta, type, target) => {
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
    },
    target: {
      value: target || window
    }
  })
}

/**
 * @param {integer} delta Scroll/resize limit in pixels
 */
export default {
  scroll(delta){
    return create(delta, 'scroll')  
  },
  resize(delta, target){
    return create(delta, 'resize', target)  
  }
}
