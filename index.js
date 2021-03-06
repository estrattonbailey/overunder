import srraf from 'srraf'

export default function overunder ({ x, x2, y, y2 }) {
  let xpos = ''
  let ypos = ''

  const evs = {}

  function on (ev, cb) {
    evs[ev] = (evs[ev] || []).concat(cb)
    return () => {
      evs[ev].splice(evs[ev].indexOf(cb), 1)
    }
  }

  function emit (ev, data) {
    (evs[ev] || []).map(cb => cb(data))
  }

  function getPosition ({
    vw: w = window.innerWidth,
    y: h = window.pageYOffset
  }) {
    const _x = x ? x.clientWidth || x : null
    const _x2 = x2 ? x2.clientWidth || x2 : null
    const _y = y ? y.nodeName ? y.getBoundingClientRect().top + h : y : null
    const _y2 = y2 ? y2.nodeName ? y2.getBoundingClientRect().top + h : y2 : null

    if (_x && w < _x && xpos !== 'under') {
      xpos = 'under'
      emit('x under')
    } else if (_x2 && w >= _x && w < _x2 && xpos !== 'between') {
      xpos = 'between'
      emit('x between')
    } else if (_x2 && w >= _x2 && xpos !== 'over') {
      xpos = 'over'
      emit('x over')
    } else if (_x && !_x2 && w >= _x && xpos !== 'over') {
      xpos = 'over'
      emit('x over')
    }

    if (_y && h < _y && ypos !== 'under') {
      ypos = 'under'
      emit('y under')
    } else if (_y2 && h >= _y && h < _y2 && ypos !== 'between') {
      ypos = 'between'
      emit('y between')
    } else if (_y2 && h >= _y2 && ypos !== 'over') {
      ypos = 'over'
      emit('y over')
    } else if (_y && !_y2 && h >= _y && ypos !== 'over') {
      ypos = 'over'
      emit('y over')
    }
  }

  const listener = srraf(getPosition)

  return {
    on,
    update ({
      x: nx = x,
      x2: nx2 = x2,
      y: ny = y,
      y2: ny2 = y2
    } = {}) {
      x = nx
      x2 = nx2
      y = ny
      y2 = ny2
      listener.update()
    },
    destroy () {
      listener.destroy()
    }
  }
}
