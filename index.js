import knot from 'knot.js'

const OVER = 'over' 
const UNDER = 'under' 
const BETWEEN = 'between' 

const isObj = o => o !== null && 'object' === typeof o && !('nodeType' in o)

const merge = (target, ...args) => {
  args.forEach(a => Object.keys(a).forEach(k => target[k] = a[k]))
  return target
}

const addProps = (target, prop) => {
  isObj(prop) ? merge(target.options, prop) : target['range'] = prop
}

const returnSize = (el, type) => {
  const isWindow = el !== null && el.window ? true : false

  if (isWindow){
    return Math.max(el[`outer${type}`], document.documentElement[`client${type}`])
  }

  return Math.max(el[`offset${type}`], el[`client${type}`])
}

/**
 * @param {string} type Either 'scroll' or 'resize'
 * @param {object|number} delta First (required) threshold
 * @param {...array} args Optional args
 */
const overunder = (type, delta, ...args) => {
  const instance = Object.create(knot({
    init: function(){
      window.addEventListener(type, checkPosition)
      if (instance.options.watchResize) window.addEventListener('resize', updateHandler)
      return instance
    },
    update: function(delta = false, ...args){
      if (delta && typeof delta === 'object'){
        addProps(instance, delta)
      } else if (delta && typeof delta === 'number' && delta !== instance.delta){
        instance.delta = delta
      } 

      /**
       * Add optional props to instance object
       */
      for (let i = 0; i < args.length; i++){
        if (args[i]) addProps(instance, args[i])
      }

      checkPosition(true)
    },
    destroy: function(){
      window.removeEventListener(type, checkPosition)
      window.removeEventListener('resize', updateHandler)
    }
  }), {
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

  return instance

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
    const isScroll = type === 'scroll' ? true : false

    /**
     * Acts as a simple debounce
     */
    let checked = false

    /** 
     * Viewport height
     */
    const viewport = document.documentElement.clientHeight

    /**
     * Distance scrolled
     */
    const scrollDelta = isScroll ? window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop : false

    /**
     * Window width
     */
    let resizeDelta = isScroll ? false : returnSize(instance.options.context, 'Width') 

    /**
     * What to compare delta/range values to
     */
    let compare = isScroll ? scrollDelta : resizeDelta

    /**
     * Cache or calculate delta and range
     */
    let delta = instance.delta
    let range = instance.range || false
    if (typeof delta === 'object'){
      delta = isScroll ? delta.getBoundingClientRect().top + scrollDelta : returnSize(delta, 'Width') 
    }
    if (typeof range === 'object'){
      range = isScroll ? range.getBoundingClientRect().top + scrollDelta : returnSize(range, 'Width') || false
    }

    /**
     * Offset values
     */
    let offset = instance.options.offset
    let negativeOffset = instance.options.negativeOffset
    if (typeof negativeOffset === 'object'){
      negativeOffset = isScroll ? returnSize(negativeOffset, 'Height') : returnSize(negativeOffset, 'Width') 
    }
    if (typeof offset === 'object'){
      offset = isScroll ? returnSize(offset, 'Height') : returnSize(offset, 'Width') 
    }

    /**
     * Calculate final delta and range values
     */
    delta = delta - offset + negativeOffset
    range = range ? range - offset + negativeOffset : false

    /**
     * If enterBottom, subtract viewport
     */
    if (instance.options.enterBottom){
      delta = delta - viewport

      if (range){
        range = range - viewport
      }
    }

    /**
     * Booleans
     */
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

export default {
  scroll: (delta, range, options) => {
    return overunder('scroll', delta, range, options)
  },
  resize: (delta, range, options) => {
    return overunder('resize', delta, range, options)
  }
} 
