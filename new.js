import knot from 'knot.js'

const OVER = 'over' 
const UNDER = 'under' 
const BETWEEN = 'between' 

const add = (target, prop) => {
  let isNumber = 'number' === typeof prop ? true : false
  let hasDelta = target.hasOwnProperty('delta') ? true : false

  let key = isNumber ? hasDelta ? 'range' : 'delta' : 'context'

  Object.defineProperty(target, key, {
    value: prop
  })
}

const instance = (type, ...args) => {
  let handler 
  let instance
  let isOver = false
  let isUnder = false
  let isBetween = false

  // API
  const proto = knot({
    init: function(){
      window.addEventListener(type, check)
      return instance
    },
    update: function(){
      check(true)
    },
    destroy: function(){
      window.removeEventListener(type, check)
    }
  })

  instance = Object.create(proto, {
    over: {
      value: false,
      writable: true
    },
    context: {
      value: window,
      writable: true
    }
  })

  args.forEach(arg => {
    if (arg) add(instance, arg)
  })

  return instance

  function check(force = false){
    let checked = false
    let scrollDelta = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
    let resizeDelta = instance.context.offsetWidth || instance.context.outerWidth
    let compare = type === 'scroll' ? scrollDelta : resizeDelta

    let delta = instance.delta
    let range = instance.range
    let over = compare >= delta && !isOver
    let under = compare < delta && !isUnder 
    let between = compare >= delta && compare < range && !isBetween && isOver && isUnder  

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
      instance.position = compare >= delta ? OVER : UNDER
      instance.emit(instance.position, instance.context)
    }
  }
}

const overunder = {
  scroll: (delta, range = false) => {
    return instance('scroll', delta, range)
  },
  resize: (delta, range = false, context = window) => {
    return instance('resize', delta, range, context)
  }
}

export default overunder
