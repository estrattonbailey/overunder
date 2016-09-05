(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.overunder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _knot = require('knot.js');

var _knot2 = _interopRequireDefault(_knot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

/**
 * @param {string} type Either 'scroll' or 'resize'
 * @param {object|number} delta First (required) threshold
 * @param {...array} args Optional args
 */
var overunder = function overunder(type, delta) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  var instance = Object.create((0, _knot2.default)({
    init: function init() {
      window.addEventListener(type, checkPosition);
      if (instance.options.watchResize) window.addEventListener('resize', checkPosition);
      return instance;
    },
    update: function update() {
      var delta = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (delta) {
        isObj(delta) ? addProps(instance, delta) : instance.delta = delta;
      }

      /**
       * Add optional props to instance object
       */

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      args.forEach(function (a) {
        return !!a ? addProps(instance, a) : null;
      });

      checkPosition(true);
    },
    destroy: function destroy() {
      window.removeEventListener(type, checkPosition);
      window.removeEventListener('resize', checkPosition);
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
  });

  /**
   * Add optional props to instance object
   */
  args.forEach(function (a) {
    return !!a ? addProps(instance, a) : null;
  });

  return instance;

  /**
   * Fired on scroll/update
   *
   * @param {boolean} force Checks immediately
   */
  function checkPosition() {
    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var isScroll = type === 'scroll' ? true : false;

    /**
     * Acts as a simple debounce
     */
    var checked = false;

    /** 
     * Viewport height
     */
    var viewport = document.documentElement.clientHeight;

    /**
     * Distance scrolled
     */
    var scrollDelta = isScroll ? window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop : false;

    /**
     * Window width
     */
    var resizeDelta = isScroll ? false : returnSize(instance.options.context, 'Width');

    /**
     * What to compare delta/range values to
     */
    var compare = isScroll ? scrollDelta : resizeDelta;

    /**
     * Cache or calculate delta and range
     */
    var delta = instance.delta;
    var range = instance.range || false;
    if ((typeof delta === 'undefined' ? 'undefined' : _typeof(delta)) === 'object') {
      delta = isScroll ? delta.getBoundingClientRect().top + scrollDelta : returnSize(delta, 'Width');
    }
    if ((typeof range === 'undefined' ? 'undefined' : _typeof(range)) === 'object') {
      range = isScroll ? range.getBoundingClientRect().top + scrollDelta : returnSize(range, 'Width') || false;
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

    var underDelta = compare < delta;
    var overDelta = compare >= delta;

    var underRange = compare < range;
    var overRange = compare >= range;

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

},{"knot.js":2}],2:[function(require,module,exports){
/*!
 * Knot.js 1.1.1 - A browser-based event emitter, for tying things together.
 * Copyright (c) 2016 Michael Cavalea - https://github.com/callmecavs/knot.js
 * License: MIT
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.Knot=e()}(this,function(){"use strict";var n={};n["extends"]=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n};var e=function(){function e(n,e){return f[n]=f[n]||[],f[n].push(e),this}function t(n,t){return t._once=!0,e(n,t),this}function r(n){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e?f[n].splice(f[n].indexOf(e),1):delete f[n],this}function o(n){for(var e=this,t=arguments.length,o=Array(t>1?t-1:0),i=1;t>i;i++)o[i-1]=arguments[i];var u=f[n]&&f[n].slice();return u&&u.forEach(function(t){t._once&&r(n,t),t.apply(e,o)}),this}var i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],f={};return n["extends"]({},i,{on:e,once:t,off:r,emit:o})};return e});
},{}]},{},[1])(1)
});