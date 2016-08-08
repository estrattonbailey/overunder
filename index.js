import knot from 'knot.js'

const OVER = 'over' 
const UNDER = 'under' 
const BETWEEN = 'between' 

/**
 * Object.assign fallback
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if ('function' != typeof Object.assign) {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }

    return target;
  };
}

/**
 * Define optional props on the 
 * instance object
 *
 * @param {object} target The overunder instance
 * @param {object|number} prop The optional arguments passed to initializer
 */
const addProps = (target, prop) => {
  let isNode = prop.nodeType ? true : false
  let isNumber = 'number' === typeof prop ? true : false

  let key = isNumber || isNode ? 'range' : 'options'

  if (isNode || isNumber){
    Object.defineProperty(target, key, {
      value: prop,
      writable: true
    })
  } else if (!isNode) {
    Object.assign(target.options, prop)
  }
}

/**
 * Instance factory
 *
 * @param {string} type Either 'scroll' or 'resize'
 * @param {object|number} delta First (required) threshold
 * @param {...array} args Optional args
 */
const instance = (type, delta, ...args) => {
  let instance
  
  /**
   * Public API
   */
  const proto = knot({
    init: function(){
      window.addEventListener(type, checkPosition)
      if (instance.options.watchResize) window.addEventListener('resize', updateHandler)
      return instance
    },
    update: function(delta = false, range = false){
      if (delta && delta !== instance.delta){
        instance.delta = delta
      } 
      if (range && range !== instance.range){
        instance.range = range
      } 
      checkPosition(true)
    },
    destroy: function(){
      window.removeEventListener(type, checkPosition)
      window.removeEventListener('resize', updateHandler)
    }
  })

  /**
   * Create prototypes and defaults
   */
  instance = Object.create(proto, {
    delta: {
      value: delta,
      writable: true
    },
    options: {
      value: {
        context: window,
        offset: 0,
        negativeOffset: 0,
        watchResize: false,
        enterBottom: false
      },
      writable: true
    }
  })

  /**
   * Add optional props to instance object
   */
  for (let i = 0; i < args.length; i++){
    if (args[i]) addProps(instance, args[i])
  }

  /**
   * Return instance!
   */
  return instance

  /**
   * Utils
   */

  /**
   * Cache ref to update handler
   * so we can remove it later
   */
  function updateHandler(){
    instance.update()
  }

  /**
   * Fired on scroll/update
   *
   * @param {boolean} force Checks immediately
   */
  function checkPosition(force = false){
    let checked = false

    let isScroll = type === 'scroll' ? true : false

    // Cache values
    let viewport = document.documentElement.clientHeight
    let scrollDelta = isScroll ? window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop : false
    let resizeDelta = !isScroll ? instance.options.context.offsetWidth || instance.options.context.outerWidth : false
    let offset = instance.options.offset
    let negativeOffset = instance.options.negativeOffset

    // What to compare delta/range values to
    let compare = isScroll ? scrollDelta : resizeDelta

    // Cache delta or calculate delta
    let delta = instance.delta
    let range = instance.range || false

    if (typeof delta === 'object'){
      delta = isScroll ? delta.getBoundingClientRect().top + scrollDelta : delta.offsetWidth || delta.outerWidth
    }

    if (typeof range === 'object'){
      range = isScroll ? range.getBoundingClientRect().top + scrollDelta : range.offsetWidth || range.outerWidth || false
    }

    if (typeof negativeOffset === 'object'){
      negativeOffset = isScroll ? negativeOffset.offsetHeight : negativeOffset.offsetWidth
    }

    if (typeof offset === 'object'){
      offset = isScroll ? offset.offsetHeight : offset.offsetWidth
    }

    delta = delta - offset + negativeOffset
    range = range ? range - offset + negativeOffset : false

    // If enterBottom, subtract viewport
    if (instance.options.enterBottom){
      delta = delta - viewport

      if (range){
        range = range - viewport
      }
    }

    let notUnder = instance.position !== UNDER 
    let notOver = instance.position !== OVER 
    let notBetween = instance.position !== BETWEEN

    let underDelta = compare < delta
    let overDelta = compare >= delta

    let underRange = compare < range
    let overRange = compare >= range

    // Final booleans
    let under = range ? underDelta && underRange && notUnder : underDelta && notUnder
    let over = range ? overDelta && overRange && notOver : overDelta && notOver
    let between = range ? overDelta && underRange && notBetween : false  

    if (over){
      instance.position = OVER 
      instance.emit(instance.position, instance)
      checked = true
    } else if (under) {
      instance.position = UNDER 
      instance.emit(instance.position, instance)
      checked = true
    } else if (between){
      instance.position = BETWEEN 
      instance.emit(instance.position, instance)
      checked = true
    }

    if (force === true && !checked){
      if (underDelta){
        instance.position = UNDER
      } else if (range && overDelta && underRange){
        instance.position = BETWEEN 
      } else if (range && overRange){
        instance.position = OVER 
      } else if (!range && overDelta){
        instance.position = OVER 
      }

      instance.emit(instance.position, instance)
    }
  }
}

const overunder = {
  scroll: (delta, range, options) => {
    return instance('scroll', delta, range, options)
  },
  resize: (delta, range, options) => {
    return instance('resize', delta, range, options)
  }
}

export default overunder
