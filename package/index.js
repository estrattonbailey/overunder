import srraf from 'srraf'
import loop from 'loop.js'

const isObj = o => o !== null && 'object' === typeof o && !('nodeType' in o)

const merge = (target, ...args) => args.reduce((target, arg) => {
  Object.keys(arg).forEach(k => target[k] = arg[k])
  return target
}, target)

const mergeOptions = (target, prop) => {
  isObj(prop) ? merge(target.config, prop) : target['range'] = prop
}

const getDimensions = (el, type) => el.window ? (
  Math.max(el[`outer${type}`], document.documentElement[`client${type}`])
) : (
  Math.max(el[`offset${type}`], el[`client${type}`])
)

class Overunder {
  constructor(type, delta, ...args) {
    this.config = {
      type: type,
      context: window,
      offset: 0,
      negativeOffset: 0,
      watchResize: false,
      enterBottom: false
    }

    this.delta = delta

    merge(this, loop())

    args.forEach(a => !!a ? mergeOptions(this, a) : null)

    if (this.config.watchResize) {
      this.listener = srraf.use(({ currY, prevY, currX }) => {
        const width = this.config.context ? (
          getDimensions(this.config.context)
        ) : currX
        this.currentPosition = this.config.type === 'scroll' ? currY : width

        this.checkPosition()
      }).update()
    } else {
      this.listener = srraf[this.config.type === 'scroll' ? 'scroll' : 'resize'].use(({ curr }) => {
        this.currentPosition = this.config.context ? (
          getDimensions(this.config.context, 'Width')
        ) : curr

        this.checkPosition()
      }).update()
    }
  }

  destroy() {
    this.listener.destroy()
  }

  update(delta = null, ...args) {
    /**
     * delta param could be obj or
     * just a delta value
     */
    if (delta){
      isObj(delta) ? mergeOptions(this, delta) : this.delta = delta
    }

    /**
     * Add optional props to instance object
     */
    args.forEach(a => !!a ? mergeOptions(this, a) : null)

    this.checkPosition(true)
  }

  checkPosition(force = false) {
    /**
     * Delta and range values
     */
    let delta = this.delta
    let range = this.range

    if (typeof this.delta === 'object'){
      delta = this.config.type === 'scroll' ? (
        delta.getBoundingClientRect().top + this.currentPosition
      ) : (
        returnSize(this.delta, 'Width')
      )
    }

    if (typeof this.range === 'object'){
      range = this.config.type === 'scroll' ? (
        this.range.getBoundingClientRect().top + this.currentPosition
      ) : (
        returnSize(this.range, 'Width') || false
      )
    }

    /**
     * Offset values
     */
    let offset = this.config.offset || null
    let negativeOffset = this.config.negativeOffset || null

    if (typeof this.offset === 'object'){
      offset = returnSize(this.offset, this.config.type === 'scroll' ? 'Height' : 'Width')
    }

    if (typeof this.negativeOffset === 'object'){
      negativeOffset = returnSize(this.negativeOffset, this.config.type === 'scroll' ? 'Height' : 'Width')
    }

    /**
     * Calculate final delta and range values
     */
    const viewport = window.innerHeight 
    delta = delta - offset + negativeOffset - viewport
    range = range ? range - offset + negativeOffset - viewport : false

    /**
     * Booleans
     */
    const notUnder = this.position !== 'under'
    const notOver = this.position !== 'over'
    const notBetween = this.position !== 'between'

    const underDelta = this.currentPosition < delta
    const overDelta = this.currentPosition >= delta

    const underRange = this.currentPosition < range
    const overRange = this.currentPosition >= range

    /**
     * Final booleans
     */
    const under = underDelta && notUnder
    const over = range ? overRange && notOver : overDelta && notOver
    const between = range && overDelta && underRange && notBetween
    const underForce = underDelta && force
    const overForce = range ? overRange && force : overDelta && force
    const betweenForce = range && overDelta && underRange && force

    if (under || underForce){
      this.position = 'under'
      this.emit(this.position, this)
    } else if (between || betweenForce){
      this.position = 'between' 
      this.emit(this.position, this)
    } else if (over || overForce){
      this.position = 'over' 
      this.emit(this.position, this)
    }
  }
}

export default {
  scroll(delta, range, options) {
    return new Overunder('scroll', delta, range, options)
  },
  resize: (delta, range, options) => {
    return new Overunder('resize', delta, range, options)
  }
}
