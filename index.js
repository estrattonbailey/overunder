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
      value: prop
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
      if (instance.options.watchResize) window.addEventListener('resize', instance.update)
      return instance
    },
    update: function(){
      checkPosition(true)
    },
    destroy: function(){
      window.removeEventListener(type, checkPosition)
      window.removeEventListener('resize', instance.update)
    }
  })

  /**
   * Create prototypes and defaults
   */
  instance = Object.create(proto, {
    delta: {
      value: delta
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

    if (isScroll){
      delta = 'number' === typeof delta ? delta : delta.getBoundingClientRect().top + scrollDelta
      delta = delta - offset + negativeOffset 
    } else {
      delta = 'number' === typeof delta ? delta : delta.offsetWidth || instance.delta.outerWidth
    }

    if (range){
      if (isScroll){
        range = 'number' === typeof range ? range : range.getBoundingClientRect().top + scrollDelta
        range = range - offset + negativeOffset 
      } else {
        range = 'number' === typeof range ? range : range.offsetWidth || instance.range.outerWidth || false
      }
    }

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
      instance.emit(instance.position, instance.context)
      checked = true
    } else if (under) {
      instance.position = UNDER 
      instance.emit(instance.position, instance.context)
      checked = true
    } else if (between){
      instance.position = BETWEEN 
      instance.emit(instance.position, instance.context)
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

      instance.emit(instance.position, instance.context)
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



