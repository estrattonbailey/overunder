'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _srraf = require('srraf');

var _srraf2 = _interopRequireDefault(_srraf);

var _loop = require('loop.js');

var _loop2 = _interopRequireDefault(_loop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isObj = function isObj(o) {
  return o !== null && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && !('nodeType' in o);
};

var merge = function merge(target) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return args.reduce(function (target, arg) {
    Object.keys(arg).forEach(function (k) {
      target[k] = arg[k];
    });
    return target;
  }, target);
};

var mergeOptions = function mergeOptions(target, prop) {
  isObj(prop) ? merge(target.config, prop) : target['range'] = prop;
};

var getDimensions = function getDimensions(el, type) {
  return el.window ? Math.max(el['inner' + type], el['outer' + type], document.documentElement['client' + type]) : Math.max(el['offset' + type], el['client' + type]);
};

var Overunder = function () {
  function Overunder(type, delta) {
    var _this = this;

    _classCallCheck(this, Overunder);

    this.config = {
      type: type,
      context: window,
      offset: 0,
      negativeOffset: 0,
      watchResize: false,
      paused: false
    };

    this.delta = delta;

    merge(this, (0, _loop2.default)());

    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    args.forEach(function (a) {
      return a ? mergeOptions(_this, a) : null;
    });

    if (this.config.watchResize) {
      this.listener = _srraf2.default.use(function (_ref) {
        var currY = _ref.currY,
            prevY = _ref.prevY,
            currX = _ref.currX;

        var width = _this.config.context ? getDimensions(_this.config.context) : currX;

        _this.currentPosition = _this.config.type === 'scroll' ? currY : width;

        _this.checkPosition();
      }).update();
    } else {
      this.listener = _srraf2.default[this.config.type].use(function (_ref2) {
        var curr = _ref2.curr;

        _this.currentPosition = _this.config.type === 'resize' ? getDimensions(_this.config.context, 'Width') : curr;

        _this.checkPosition();
      }).update();
    }
  }

  _createClass(Overunder, [{
    key: 'destroy',
    value: function destroy() {
      this.listener.destroy();
    }
  }, {
    key: 'update',
    value: function update() {
      var _this2 = this;

      var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      /**
       * delta param could be obj or
       * just a delta value
       */
      if (delta) {
        isObj(delta) ? mergeOptions(this, delta) : this.delta = delta;
      }

      /**
       * Add optional props to instance object
       */

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      args.forEach(function (a) {
        return a ? mergeOptions(_this2, a) : null;
      });

      return this;
    }
  }, {
    key: 'check',
    value: function check() {
      this.checkPosition(true);
      return this;
    }
  }, {
    key: 'checkPosition',
    value: function checkPosition() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (this.config.paused) return;

      /**
       * Delta and range values
       */
      var delta = this.delta;
      var range = this.range;

      if (_typeof(this.delta) === 'object') {
        delta = this.config.type === 'scroll' ? delta.getBoundingClientRect().top + this.currentPosition : getDimensions(this.delta, 'Width');
      }

      if (_typeof(this.range) === 'object') {
        range = this.config.type === 'scroll' ? this.range.getBoundingClientRect().top + this.currentPosition : getDimensions(this.range, 'Width') || false;
      }

      /**
       * Offset values
       */
      var offset = this.config.offset || null;
      var negativeOffset = this.config.negativeOffset || null;

      if (offset && (typeof offset === 'undefined' ? 'undefined' : _typeof(offset)) === 'object') {
        offset = getDimensions(offset, this.config.type === 'scroll' ? 'Height' : 'Width');
      }

      if (negativeOffset && (typeof negativeOffset === 'undefined' ? 'undefined' : _typeof(negativeOffset)) === 'object') {
        negativeOffset = getDimensions(negativeOffset, this.config.type === 'scroll' ? 'Height' : 'Width');
      }

      /**
       * Calculate final delta and range values
       */
      var viewport = window.innerHeight;
      delta = delta - viewport - offset + negativeOffset;
      range = range ? range - viewport - offset + negativeOffset : false;

      /**
       * Booleans
       */
      var notUnder = this.position !== 'under';
      var notOver = this.position !== 'over';
      var notBetween = this.position !== 'between';

      var underDelta = this.currentPosition < delta;
      var overDelta = this.currentPosition >= delta;

      var underRange = this.currentPosition < range;
      var overRange = this.currentPosition >= range;

      /**
       * Final booleans
       */
      var under = underDelta && notUnder;
      var over = range ? overRange && notOver : overDelta && notOver;
      var between = range && overDelta && underRange && notBetween;
      var underForce = underDelta && force;
      var overForce = range ? overRange && force : overDelta && force;
      var betweenForce = range && overDelta && underRange && force;

      if (under || underForce) {
        this.position = 'under';
        this.emit(this.position, this);
      } else if (between || betweenForce) {
        this.position = 'between';
        this.emit(this.position, this);
      } else if (over || overForce) {
        this.position = 'over';
        this.emit(this.position, this);
      }
    }
  }]);

  return Overunder;
}();

exports.default = {
  scroll: function scroll(delta, range, options) {
    return new Overunder('scroll', delta, range, options);
  },
  resize: function resize(delta, range, options) {
    return new Overunder('resize', delta, range, options);
  }
};