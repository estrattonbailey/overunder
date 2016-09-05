(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.overunder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var OVER = 'over';
var UNDER = 'under';
var BETWEEN = 'between';

var isObj = function isObj(o) {
  return o !== null && 'object' === (typeof o === 'undefined' ? 'undefined' : _typeof(o)) && !('nodeType' in o);
};

var merge = function merge(target) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args.forEach(function (a) {
    return Object.keys(a).forEach(function (k) {
      return target[k] = a[k];
    });
  });
  return target;
};

var addProps = function addProps(target, prop) {
  isObj(prop) ? merge(target.options, prop) : target['range'] = prop;
};

var returnSize = function returnSize(el, type) {
  var isWindow = el !== null && el.window ? true : false;

  if (isWindow) {
    return Math.max(el['outer' + type], document.documentElement['client' + type]);
  }

  return Math.max(el['offset' + type], el['client' + type]);
};

var returnScroll = function returnScroll() {
  return window.scrollY || window.pageYOffset;
};

/**
 * @param {string} type Either 'scroll' or 'resize'
 * @param {object|number} delta First (required) threshold
 * @param {...array} args Optional args
 */
var overunder = function overunder(type, delta) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var ticking = false;
  var isScroll = type === 'scroll' ? true : false;
  var listeners = {};

  var instance = Object.create({
    init: function init() {
      window.addEventListener(type, requestPosition);
      if (this.options.watchResize) window.addEventListener('resize', requestPosition);
      return this;
    },
    update: function update() {
      var _this = this;

      var delta = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (delta) {
        isObj(delta) ? addProps(this, delta) : this.delta = delta;
      }

      /**
       * Add optional props to instance object
       */

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      args.forEach(function (a) {
        return !!a ? addProps(_this, a) : null;
      });

      requestPosition(true);
    },
    destroy: function destroy() {
      window.removeEventListener(type, requestPosition);
      window.removeEventListener('resize', requestPosition);
    },
    on: function on(e) {
      var cb = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (!cb) return;
      listeners[e] = listeners[e] || { queue: [] };
      listeners[e].queue.push(cb);
    },
    emit: function emit(e) {
      var data = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

      var items = listeners[e] ? listeners[e].queue : false;
      items && items.forEach(function (i) {
        return i(data);
      });
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
  });

  /**
   * Add optional props to instance object
   */
  args.forEach(function (a) {
    return !!a ? addProps(instance, a) : null;
  });

  var currentPosition = returnPosition();

  return instance;

  function returnPosition() {
    return isScroll ? returnScroll() : returnSize(instance.options.context, 'Width');
  }

  function requestPosition() {
    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    currentPosition = returnPosition();

    if (!ticking) {
      requestAnimationFrame(function () {
        return checkPosition(force);
      });
      ticking = true;
    }
  }

  /**
   * @param {boolean} force Checks immediately
   */
  function checkPosition() {
    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    /**
     * Check only once per call 
     */
    var checked = false;

    /** 
     * Viewport height
     */
    var viewport = window.innerHeight;

    /**
     * Cache or calculate delta and range
     */
    var delta = instance.delta;
    var range = instance.range || false;
    if ((typeof delta === 'undefined' ? 'undefined' : _typeof(delta)) === 'object') {
      delta = isScroll ? delta.getBoundingClientRect().top + currentPosition : returnSize(delta, 'Width');
    }
    if ((typeof range === 'undefined' ? 'undefined' : _typeof(range)) === 'object') {
      range = isScroll ? range.getBoundingClientRect().top + currentPosition : returnSize(range, 'Width') || false;
    }

    /**
     * Offset values
     */
    var offset = instance.options.offset;
    var negativeOffset = instance.options.negativeOffset;
    if ((typeof negativeOffset === 'undefined' ? 'undefined' : _typeof(negativeOffset)) === 'object') {
      negativeOffset = isScroll ? returnSize(negativeOffset, 'Height') : returnSize(negativeOffset, 'Width');
    }
    if ((typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) === 'object') {
      offset = isScroll ? returnSize(offset, 'Height') : returnSize(offset, 'Width');
    }

    /**
     * Calculate final delta and range values
     */
    delta = delta - offset + negativeOffset;
    range = range ? range - offset + negativeOffset : false;

    /**
     * If enterBottom, subtract viewport
     */
    if (instance.options.enterBottom) {
      delta = delta - viewport;

      if (range) {
        range = range - viewport;
      }
    }

    /**
     * Booleans
     */
    var notUnder = instance.position !== UNDER;
    var notOver = instance.position !== OVER;
    var notBetween = instance.position !== BETWEEN;

    var underDelta = currentPosition < delta;
    var overDelta = currentPosition >= delta;

    var underRange = currentPosition < range;
    var overRange = currentPosition >= range;

    // Final booleans
    var under = range ? underDelta && underRange && notUnder : underDelta && notUnder;
    var over = range ? overDelta && overRange && notOver : overDelta && notOver;
    var between = range ? overDelta && underRange && notBetween : false;

    if (over) {
      instance.position = OVER;
      instance.emit(instance.position, instance);
      checked = true;
    } else if (under) {
      instance.position = UNDER;
      instance.emit(instance.position, instance);
      checked = true;
    } else if (between) {
      instance.position = BETWEEN;
      instance.emit(instance.position, instance);
      checked = true;
    }

    if (force === true && !checked) {
      if (underDelta) {
        instance.position = UNDER;
      } else if (range && overDelta && underRange) {
        instance.position = BETWEEN;
      } else if (range && overRange) {
        instance.position = OVER;
      } else if (!range && overDelta) {
        instance.position = OVER;
      }

      instance.emit(instance.position, instance);
    }

    ticking = false;
  }
};

exports.default = {
  scroll: function scroll(delta, range, options) {
    return overunder('scroll', delta, range, options);
  },
  resize: function resize(delta, range, options) {
    return overunder('resize', delta, range, options);
  }
};

},{}]},{},[1])(1)
});