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

/**
 * Compare a variable value i.e. scrollY with
 * the user-passed delta value.
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {integer} compare window.scrollY/outerWidth
 * @param {boolean} update Force an update of this.position
 */
var check = function check(delta, compare, target) {
  var update = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  var triggered = false;

  if (compare >= delta && this.position !== OVER) {
    this.position = OVER;
    this.emit(this.position, target);
    triggered = true;
  } else if (compare < delta && this.position === OVER) {
    this.position = UNDER;
    this.emit(this.position, target);
    triggered = true;
  }

  if (update === true && !triggered) {
    this.position = compare >= delta ? OVER : UNDER;
    this.emit(this.position, target);
  }
};

/**
 * Namespace for scroll/resize handlers
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {boolean} update Force an update of this.position
 */
var watch = {
  scroll: function scroll(delta, target, update) {
    var compare = target.scrollY || target.scrollYOffset;
    check.call(this, delta, compare, window, update);
  },
  resize: function resize(delta, target, update) {
    var compare = target.offsetWidth || target.outerWidth;
    check.call(this, delta, compare, target, update);
  }
};

/**
 * Public prototype methods that will be attached
 * to the return value of create()
 */
var proto = {
  update: function update() {
    watch[this.type].call(this, this.delta, this.target, true);
    return this;
  },
  init: function init() {
    this.handler = watch[this.type].bind(this, this.delta, this.target);
    window.addEventListener(this.type, this.handler);
    return this;
  },
  destroy: function destroy() {
    window.removeEventListener(this.type, this.handler);
    this.off(OVER);
    this.off(UNDER);
  }
};

/**
 * Create instance with user-passed
 * values and prototypes
 *
 * @param {integer} delta Scroll/resize limit in pixels
 * @param {string} type Either scroll or resize
 */
var create = function create(delta, type, target) {
  return Object.create((0, _knot2.default)(proto), {
    type: {
      value: type
    },
    delta: {
      value: delta
    },
    position: {
      value: UNDER,
      writable: true
    },
    target: {
      value: target || window
    }
  });
};

/**
 * @param {integer} delta Scroll/resize limit in pixels
 */
exports.default = {
  scroll: function scroll(delta) {
    return create(delta, 'scroll');
  },
  resize: function resize(delta, target) {
    return create(delta, 'resize', target);
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