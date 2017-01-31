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

const returnScroll = () => window.scrollY || window.pageYOffset

/**
 * @param {string} type Either 'scroll' or 'resize'
 * @param {object|number} delta First (required) threshold
 * @param {...array} args Optional args
 */
const overunder = (type, delta, ...args) => {
  let ticking = false 
  const isScroll = type === 'scroll' ? true : false
  const listeners = {}

  const instance = Object.create({
    init: function(){
      window.addEventListener(type, requestPosition)
      if (this.options.watchResize) window.addEventListener('resize', requestPosition)
      return this 
    },
    update: function(delta = null, ...args){
      if (delta){
        isObj(delta) ? addProps(this, delta) : this.delta = delta
      }

      /**
       * Add optional props to instance object
       */
      args.forEach(a => !!a ? addProps(this, a) : null)

      requestPosition(true)
    },
    destroy: function(){
      window.removeEventListener(type, requestPosition)
      window.removeEventListener('resize', requestPosition)
    },
    on: function(e, cb = null){
      if (!cb) return
      listeners[e] = listeners[e] || { queue: [] }
      listeners[e].queue.push(cb)
    },
    emit: function(e, data = undefined){
      let items = listeners[e] ? listeners[e].queue : false
      items && items.forEach(i => i(data))
    }
  }, {
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
   * @param {boolean} force Checks immediately
   */
  function checkPosition(force = false){
    /**
     * Check only once per call 
     */
    let checked = false

    /** 
     * Viewport height
     */
    const viewport = window.innerHeight 

    /**
     * Cache or calculate delta and range
     */
    let delta = instance.delta
    let range = instance.range || false
    if (typeof delta === 'object'){
      delta = isScroll ? delta.getBoundingClientRect().top + currentPosition : returnSize(delta, 'Width') 
    }
    if (typeof range === 'object'){
      range = isScroll ? range.getBoundingClientRect().top + currentPosition : returnSize(range, 'Width') || false
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

    let underDelta = currentPosition < delta
    let overDelta = currentPosition >= delta

    let underRange = currentPosition < range
    let overRange = currentPosition >= range

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

    ticking = false
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
