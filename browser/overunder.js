(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.overunder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _knot = require('knot.js');

var _knot2 = _interopRequireDefault(_knot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OVER = 'over';
var UNDER = 'under';
var BETWEEN = 'between';

/**
 * Object.assign fallback
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if ('function' != typeof Object.assign) {
  Object.assign = function (target) {
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
var addProps = function addProps(target, prop) {
  var isNode = prop.nodeType ? true : false;
  var isNumber = 'number' === typeof prop ? true : false;

  var key = isNumber || isNode ? 'range' : 'options';

  if (isNode || isNumber) {
    Object.defineProperty(target, key, {
      value: prop
    });
  } else if (!isNode) {
    Object.assign(target.options, prop);
  }
};

/**
 * Instance factory
 *
 * @param {string} type Either 'scroll' or 'resize'
 * @param {object|number} delta First (required) threshold
 * @param {...array} args Optional args
 */
var instance = function instance(type, delta) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var instance = void 0;

  /**
   * Public API
   */
  var proto = (0, _knot2.default)({
    init: function init() {
      window.addEventListener(type, checkPosition);
      if (instance.options.watchResize) window.addEventListener('resize', instance.update);
      return instance;
    },
    update: function update() {
      checkPosition(true);
    },
    destroy: function destroy() {
      window.removeEventListener(type, checkPosition);
      window.removeEventListener('resize', instance.update);
    }
  });

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
  });

  /**
   * Add optional props to instance object
   */
  for (var i = 0; i < args.length; i++) {
    if (args[i]) addProps(instance, args[i]);
  }

  /**
   * Return instance!
   */
  return instance;

  /**
   * Utils
   */

  /**
   * Fired on scroll/update
   *
   * @param {boolean} force Checks immediately
   */
  function checkPosition() {
    var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var checked = false;

    var isScroll = type === 'scroll' ? true : false;

    // Cache values
    var viewport = document.documentElement.clientHeight;
    var scrollDelta = isScroll ? window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop : false;
    var resizeDelta = !isScroll ? instance.options.context.offsetWidth || instance.options.context.outerWidth : false;
    var offset = instance.options.offset;
    var negativeOffset = instance.options.negativeOffset;

    // What to compare delta/range values to
    var compare = isScroll ? scrollDelta : resizeDelta;

    // Cache delta or calculate delta
    var delta = instance.delta;
    var range = instance.range || false;

    if (isScroll) {
      delta = 'number' === typeof delta ? delta : delta.getBoundingClientRect().top + scrollDelta;
      delta = delta - offset + negativeOffset;
    } else {
      delta = 'number' === typeof delta ? delta : delta.offsetWidth || instance.delta.outerWidth;
    }

    if (range) {
      if (isScroll) {
        range = 'number' === typeof range ? range : range.getBoundingClientRect().top + scrollDelta;
        range = range - offset + negativeOffset;
      } else {
        range = 'number' === typeof range ? range : range.offsetWidth || instance.range.outerWidth || false;
      }
    }

    // If enterBottom, subtract viewport
    if (instance.options.enterBottom) {
      delta = delta - viewport;

      if (range) {
        range = range - viewport;
      }
    }

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
      instance.emit(instance.position, instance.context);
      checked = true;
    } else if (under) {
      instance.position = UNDER;
      instance.emit(instance.position, instance.context);
      checked = true;
    } else if (between) {
      instance.position = BETWEEN;
      instance.emit(instance.position, instance.context);
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

      instance.emit(instance.position, instance.context);
    }
  }
};

var overunder = {
  scroll: function scroll(delta, range, options) {
    return instance('scroll', delta, range, options);
  },
  resize: function resize(delta, range, options) {
    return instance('resize', delta, range, options);
  }
};

exports.default = overunder;

},{"knot.js":2}],2:[function(require,module,exports){
/*!
 * Knot.js 1.1.1 - A browser-based event emitter, for tying things together.
 * Copyright (c) 2016 Michael Cavalea - https://github.com/callmecavs/knot.js
 * License: MIT
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):n.Knot=e()}(this,function(){"use strict";var n={};n["extends"]=Object.assign||function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n};var e=function(){function e(n,e){return f[n]=f[n]||[],f[n].push(e),this}function t(n,t){return t._once=!0,e(n,t),this}function r(n){var e=arguments.length<=1||void 0===arguments[1]?!1:arguments[1];return e?f[n].splice(f[n].indexOf(e),1):delete f[n],this}function o(n){for(var e=this,t=arguments.length,o=Array(t>1?t-1:0),i=1;t>i;i++)o[i-1]=arguments[i];var u=f[n]&&f[n].slice();return u&&u.forEach(function(t){t._once&&r(n,t),t.apply(e,o)}),this}var i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],f={};return n["extends"]({},i,{on:e,once:t,off:r,emit:o})};return e});
},{}]},{},[1])(1)
});