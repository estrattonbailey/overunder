(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.overunder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';var _createClass=function(){function b(c,d){for(var f,e=0;e<d.length;e++)f=d[e],f.enumerable=f.enumerable||!1,f.configurable=!0,'value'in f&&(f.writable=!0),Object.defineProperty(c,f.key,f)}return function(c,d,e){return d&&b(c.prototype,d),e&&b(c,e),c}}(),_typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(b){return typeof b}:function(b){return b&&'function'==typeof Symbol&&b.constructor===Symbol&&b!==Symbol.prototype?'symbol':typeof b},_srraf=require('srraf'),_srraf2=_interopRequireDefault(_srraf),_loop=require('loop.js'),_loop2=_interopRequireDefault(_loop);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(b){return b&&b.__esModule?b:{default:b}}function _classCallCheck(b,c){if(!(b instanceof c))throw new TypeError('Cannot call a class as a function')}var isObj=function(b){return null!==b&&'object'===('undefined'==typeof b?'undefined':_typeof(b))&&!('nodeType'in b)},merge=function(b){for(var d=arguments.length,c=Array(1<d?d-1:0),e=1;e<d;e++)c[e-1]=arguments[e];return c.reduce(function(f,g){return Object.keys(g).forEach(function(h){f[h]=g[h]}),f},b)},mergeOptions=function(b,c){isObj(c)?merge(b.config,c):b.range=c},getDimensions=function(b,c){return b.window?Math.max(b['inner'+c],b['outer'+c],document.documentElement['client'+c]):Math.max(b['offset'+c],b['client'+c])},Overunder=function(){function b(h,j){var p=this;_classCallCheck(this,b),this.config={type:h,context:window,offset:0,negativeOffset:0,watchResize:!1,paused:!1},this.delta=j,merge(this,(0,_loop2.default)());for(var m=arguments.length,l=Array(2<m?m-2:0),n=2;n<m;n++)l[n-2]=arguments[n];l.forEach(function(q){return q?mergeOptions(p,q):null}),this.listener=this.config.watchResize?_srraf2.default.use(function(_ref){var q=_ref.currY,r=_ref.prevY,s=_ref.currX,t=p.config.context?getDimensions(p.config.context):s;p.currentPosition='scroll'===p.config.type?q:t,p.checkPosition()}).update():_srraf2.default[this.config.type].use(function(_ref2){var q=_ref2.curr;p.currentPosition='resize'===p.config.type?getDimensions(p.config.context,'Width'):q,p.checkPosition()}).update()}return _createClass(b,[{key:'destroy',value:function destroy(){this.listener.destroy()}},{key:'update',value:function update(){var n=this,m=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;m&&(isObj(m)?mergeOptions(this,m):this.delta=m);for(var j=arguments.length,h=Array(1<j?j-1:0),l=1;l<j;l++)h[l-1]=arguments[l];return h.forEach(function(p){return p?mergeOptions(n,p):null}),this}},{key:'check',value:function check(){return this.checkPosition(!0),this}},{key:'checkPosition',value:function checkPosition(){var h=0<arguments.length&&void 0!==arguments[0]&&arguments[0];if(!this.config.paused){var j=this.delta,l=this.range;'object'===_typeof(this.delta)&&(j='scroll'===this.config.type?j.getBoundingClientRect().top+this.currentPosition:getDimensions(this.delta,'Width')),'object'===_typeof(this.range)&&(l='scroll'===this.config.type?this.range.getBoundingClientRect().top+this.currentPosition:getDimensions(this.range,'Width')||!1);var m=this.config.offset||null,n=this.config.negativeOffset||null;m&&'object'===('undefined'==typeof m?'undefined':_typeof(m))&&(m=getDimensions(m,'scroll'===this.config.type?'Height':'Width')),n&&'object'===('undefined'==typeof n?'undefined':_typeof(n))&&(n=getDimensions(n,'scroll'===this.config.type?'Height':'Width'));var p=window.innerHeight;j=j-p-m+n,l=!!l&&l-p-m+n;var q='under'!==this.position,r='over'!==this.position,s='between'!==this.position,t=this.currentPosition<j,u=this.currentPosition>=j,v=this.currentPosition<l,w=this.currentPosition>=l,y=l?w&&r:u&&r,z=l&&u&&v&&s,B=l?w&&h:u&&h,C=l&&u&&v&&h;t&&q||t&&h?(this.position='under',this.emit(this.position,this)):z||C?(this.position='between',this.emit(this.position,this)):(y||B)&&(this.position='over',this.emit(this.position,this))}}}]),b}();exports.default={scroll:function scroll(b,c,d){return new Overunder('scroll',b,c,d)},resize:function resize(b,c,d){return new Overunder('resize',b,c,d)}};

},{"loop.js":2,"srraf":3}],2:[function(require,module,exports){
"use strict";var _extends=Object.assign||function(e){for(var i,k=1;k<arguments.length;k++)for(var l in i=arguments[k],i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l]);return e};Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i={};return _extends({},e,{emit:function(l){var m=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,n=!!i[l]&&i[l].queue;n&&n.forEach(function(o){return o(m)})},on:function(l){var m=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;m&&(i[l]=i[l]||{queue:[]},i[l].queue.push(m))}})};

},{}],3:[function(require,module,exports){
'use strict';var _createClass=function(){function a(b,c){for(var f,d=0;d<c.length;d++)f=c[d],f.enumerable=f.enumerable||!1,f.configurable=!0,'value'in f&&(f.writable=!0),Object.defineProperty(b,f.key,f)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(exports,'__esModule',{value:!0});function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var scrollInstance=null,resizeInstance=null,Listener=function(){function a(b){_classCallCheck(this,a),this.type=b,this.pool=0,this.queue=[],this.curr=this.position(),this.prev=this.position(),this.ticking=!1,window.addEventListener(b,this.requestFrame.bind(this))}return _createClass(a,[{key:'position',value:function position(){return'scroll'===this.type?window.scrollY||window.pageYOffset:window.innerWidth}},{key:'requestFrame',value:function requestFrame(b){this.e=b,this.curr=this.position(),this.ticking||(window.requestAnimationFrame(this.run.bind(this)),this.ticking=!0)}},{key:'run',value:function run(){var b=this;this.queue.forEach(function(c){return c[1]({curr:b.curr,prev:b.prev},b.e)}),this.prev=this.curr,this.ticking=!1}},{key:'use',value:function use(b){var c=this,d=c.pool++;return c.queue.push([d,b]),{destroy:function destroy(){return c.queue.forEach(function(f,g){f[0]===d&&c.queue.splice(g,1)}),this},update:function update(){return b({curr:c.curr,prev:c.prev},c.e),this}}}},{key:'update',value:function update(){this.run()}}]),a}();exports.default='undefined'==typeof window?null:{get scroll(){return scrollInstance||(scrollInstance=new Listener('scroll')),scrollInstance},get resize(){return resizeInstance||(resizeInstance=new Listener('resize')),resizeInstance},use:function use(a){var _scroll=this.scroll,b=_scroll.curr,c=_scroll.prev,_resize=this.resize,d=_resize.curr,f=_resize.prev,g={currY:b,prevY:c,currX:d,prevX:f},h=this.scroll.use(function(_ref,m){var k=_ref.curr,l=_ref.prev;g.currY=k,g.prevY=l,a(g,m)}),j=this.resize.use(function(_ref2,m){var k=_ref2.curr,l=_ref2.prev;g.currX=k,g.prevX=l,a(g,m)});return{destroy:function destroy(){return h.destroy(),j.destroy(),this},update:function update(){return h.update(),j.update(),this}}}};
},{}]},{},[1])(1)
});