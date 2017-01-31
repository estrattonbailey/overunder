(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _index = require('../package/index.js');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scroller = _index2.default.scroll(1000, 2000, { watchResize: true });

window.scroller = scroller;

scroller.on('under', function () {
  return console.log('under');
});
scroller.on('between', function () {
  return console.log('between');
});
scroller.on('over', function () {
  return console.log('over');
});

},{"../package/index.js":2}],2:[function(require,module,exports){
'use strict';var _createClass=function(){function b(c,d){for(var f,e=0;e<d.length;e++)f=d[e],f.enumerable=f.enumerable||!1,f.configurable=!0,'value'in f&&(f.writable=!0),Object.defineProperty(c,f.key,f)}return function(c,d,e){return d&&b(c.prototype,d),e&&b(c,e),c}}(),_typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(b){return typeof b}:function(b){return b&&'function'==typeof Symbol&&b.constructor===Symbol&&b!==Symbol.prototype?'symbol':typeof b},_srraf=require('srraf'),_srraf2=_interopRequireDefault(_srraf),_loop=require('loop.js'),_loop2=_interopRequireDefault(_loop);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(b){return b&&b.__esModule?b:{default:b}}function _classCallCheck(b,c){if(!(b instanceof c))throw new TypeError('Cannot call a class as a function')}var isObj=function(b){return null!==b&&'object'===('undefined'==typeof b?'undefined':_typeof(b))&&!('nodeType'in b)},merge=function(b){for(var d=arguments.length,c=Array(1<d?d-1:0),e=1;e<d;e++)c[e-1]=arguments[e];return c.reduce(function(f,g){return Object.keys(g).forEach(function(h){return f[h]=g[h]}),f},b)},mergeOptions=function(b,c){isObj(c)?merge(b.config,c):b.range=c},getDimensions=function(b,c){return b.window?Math.max(b['outer'+c],document.documentElement['client'+c]):Math.max(b['offset'+c],b['client'+c])},Overunder=function(){function b(h,j){var p=this;_classCallCheck(this,b),this.config={type:h,context:window,offset:0,negativeOffset:0,watchResize:!1,enterBottom:!1},this.delta=j,merge(this,(0,_loop2.default)());for(var m=arguments.length,l=Array(2<m?m-2:0),n=2;n<m;n++)l[n-2]=arguments[n];l.forEach(function(q){return q?mergeOptions(p,q):null}),this.listener=this.config.watchResize?_srraf2.default.use(function(_ref){var q=_ref.currY,r=_ref.prevY,s=_ref.currX,t=p.config.context?getDimensions(p.config.context):s;p.currentPosition='scroll'===p.config.type?q:t,p.checkPosition()}).update():_srraf2.default['scroll'===this.config.type?'scroll':'resize'].use(function(_ref2){var q=_ref2.curr;p.currentPosition=p.config.context?getDimensions(p.config.context,'Width'):q,p.checkPosition()}).update()}return _createClass(b,[{key:'destroy',value:function destroy(){this.listener.destroy()}},{key:'update',value:function update(){var n=this,m=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;m&&(isObj(m)?mergeOptions(this,m):this.delta=m);for(var j=arguments.length,h=Array(1<j?j-1:0),l=1;l<j;l++)h[l-1]=arguments[l];h.forEach(function(p){return p?mergeOptions(n,p):null}),this.checkPosition(!0)}},{key:'checkPosition',value:function checkPosition(){var h=0<arguments.length&&void 0!==arguments[0]&&arguments[0],j=this.delta,l=this.range;'object'===_typeof(this.delta)&&(j='scroll'===this.config.type?j.getBoundingClientRect().top+this.currentPosition:returnSize(this.delta,'Width')),'object'===_typeof(this.range)&&(l='scroll'===this.config.type?this.range.getBoundingClientRect().top+this.currentPosition:returnSize(this.range,'Width')||!1);var m=this.config.offset||null,n=this.config.negativeOffset||null;'object'===_typeof(this.offset)&&(m=returnSize(this.offset,'scroll'===this.config.type?'Height':'Width')),'object'===_typeof(this.negativeOffset)&&(n=returnSize(this.negativeOffset,'scroll'===this.config.type?'Height':'Width'));var p=window.innerHeight;j=j-m+n-p,l=!!l&&l-m+n-p;var q='under'!==this.position,r='over'!==this.position,s='between'!==this.position,t=this.currentPosition<j,u=this.currentPosition>=j,v=this.currentPosition<l,w=this.currentPosition>=l,y=l?w&&r:u&&r,z=l&&u&&v&&s,B=l?w&&h:u&&h,C=l&&u&&v&&h;t&&q||t&&h?(this.position='under',this.emit(this.position,this)):z||C?(this.position='between',this.emit(this.position,this)):(y||B)&&(this.position='over',this.emit(this.position,this))}}]),b}();exports.default={scroll:function scroll(b,c,d){return new Overunder('scroll',b,c,d)},resize:function resize(b,c,d){return new Overunder('resize',b,c,d)}};

},{"loop.js":3,"srraf":4}],3:[function(require,module,exports){
"use strict";var _extends=Object.assign||function(e){for(var i,k=1;k<arguments.length;k++)for(var l in i=arguments[k],i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l]);return e};Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},i={};return _extends({},e,{emit:function(l){var m=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,n=!!i[l]&&i[l].queue;n&&n.forEach(function(o){return o(m)})},on:function(l){var m=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;m&&(i[l]=i[l]||{queue:[]},i[l].queue.push(m))}})};

},{}],4:[function(require,module,exports){
'use strict';var _createClass=function(){function a(b,c){for(var f,d=0;d<c.length;d++)f=c[d],f.enumerable=f.enumerable||!1,f.configurable=!0,'value'in f&&(f.writable=!0),Object.defineProperty(b,f.key,f)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}();Object.defineProperty(exports,'__esModule',{value:!0});function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}var scrollInstance=null,resizeInstance=null,Listener=function(){function a(b){_classCallCheck(this,a),this.type=b,this.pool=0,this.queue=[],this.curr=this.position(),this.prev=this.position(),this.ticking=!1,window.addEventListener(b,this.requestFrame.bind(this))}return _createClass(a,[{key:'position',value:function position(){return'scroll'===this.type?window.scrollY||window.pageYOffset:window.innerWidth}},{key:'requestFrame',value:function requestFrame(b){this.e=b,this.curr=this.position(),this.ticking||(window.requestAnimationFrame(this.run.bind(this)),this.ticking=!0)}},{key:'run',value:function run(){var b=this;this.queue.forEach(function(c){return c[1]({curr:b.curr,prev:b.prev},b.e)}),this.prev=this.curr,this.ticking=!1}},{key:'use',value:function use(b){var c=this,d=c.pool++;return c.queue.push([d,b]),{destroy:function destroy(){return c.queue.forEach(function(f,g){f[0]===d&&c.queue.splice(g,1)}),this},update:function update(){return b({curr:c.curr,prev:c.prev},c.e),this}}}},{key:'update',value:function update(){this.run()}}]),a}();exports.default='undefined'==typeof window?null:{get scroll(){return scrollInstance||(scrollInstance=new Listener('scroll')),scrollInstance},get resize(){return resizeInstance||(resizeInstance=new Listener('resize')),resizeInstance},use:function use(a){var _scroll=this.scroll,b=_scroll.curr,c=_scroll.prev,_resize=this.resize,d=_resize.curr,f=_resize.prev,g={currY:b,prevY:c,currX:d,prevX:f},h=this.scroll.use(function(_ref,m){var k=_ref.curr,l=_ref.prev;g.currY=k,g.prevY=l,a(g,m)}),j=this.resize.use(function(_ref2,m){var k=_ref2.curr,l=_ref2.prev;g.currX=k,g.prevX=l,a(g,m)});return{destroy:function destroy(){return h.destroy(),j.destroy(),this},update:function update(){return h.update(),j.update(),this}}}};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIi4uL3BhY2thZ2UvaW5kZXguanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9sb29wLmpzL2Rpc3QvaW5kZXguanMiLCIuLi9wYWNrYWdlL25vZGVfbW9kdWxlcy9zcnJhZi9kaXN0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7O0FBRUEsSUFBTSxXQUFXLGdCQUFVLE1BQVYsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsRUFBQyxhQUFhLElBQWQsRUFBN0IsQ0FBakI7O0FBRUEsT0FBTyxRQUFQLEdBQWtCLFFBQWxCOztBQUVBLFNBQVMsRUFBVCxDQUFZLE9BQVosRUFBcUI7QUFBQSxTQUFNLFFBQVEsR0FBUixDQUFZLE9BQVosQ0FBTjtBQUFBLENBQXJCO0FBQ0EsU0FBUyxFQUFULENBQVksU0FBWixFQUF1QjtBQUFBLFNBQU0sUUFBUSxHQUFSLENBQVksU0FBWixDQUFOO0FBQUEsQ0FBdkI7QUFDQSxTQUFTLEVBQVQsQ0FBWSxNQUFaLEVBQW9CO0FBQUEsU0FBTSxRQUFRLEdBQVIsQ0FBWSxNQUFaLENBQU47QUFBQSxDQUFwQjs7O3UwQkNMQSxHQUFNLE9BQVEsa0JBQVcsS0FBTixNQUFjLCtCQUFvQixFQUFwQixxQkFBb0IsQ0FBcEIsRUFBZCxFQUF1QyxFQUFFLFlBQWMsRUFBaEIsQ0FBNUMsQ0FBZCxDQUVNLE1BQVEsU0FBQyxDQUFELDZCQUFZLENBQVosOEJBQVksQ0FBWix5QkFBcUIsR0FBSyxNQUFMLENBQVksU0FBQyxDQUFELENBQVMsQ0FBVCxDQUFpQixDQUU5RCxNQURBLFFBQU8sSUFBUCxDQUFZLENBQVosRUFBaUIsT0FBakIsQ0FBeUIsa0JBQUssR0FBTyxDQUFQLEVBQVksRUFBSSxDQUFKLENBQWpCLENBQXpCLENBQ0EsQ0FBTyxDQUNSLENBSGtDLENBR2hDLENBSGdDLENBQXJCLENBRmQs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QUYsQ0FBakQsRUFBdUQsTUFBTyxFQUFFLENBQTNLLENBQTRLLE9BQU8sY0FBUCxDQUFzQixPQUF0QixDQUE4QixZQUE5QixDQUEyQyxDQUFDLE1BQU0sQ0FBQyxDQUFSLENBQTNDLEMsQ0FBdUQsUUFBUSxPQUFSLENBQWdCLFVBQVUsQ0FBQyxHQUFJLEdBQUUsRUFBRSxVQUFVLE1BQVosRUFBbUMsSUFBSyxFQUFwQixhQUFVLENBQVYsQ0FBcEIsQ0FBMEMsVUFBVSxDQUFWLENBQTFDLEdBQU4sQ0FBZ0UsSUFBaEUsQ0FBcUUsTUFBTyxhQUFZLENBQVosQ0FBYyxDQUFDLEtBQUssU0FBVyxDQUFYLENBQWEsQ0FBQyxHQUFJLEdBQUUsRUFBRSxVQUFVLE1BQVosRUFBbUMsSUFBSyxFQUFwQixhQUFVLENBQVYsQ0FBcEIsQ0FBMEMsVUFBVSxDQUFWLENBQTFDLENBQXVELElBQTdELENBQWtFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBRixDQUFGLEVBQVEsRUFBRSxDQUFGLEVBQUssS0FBakYsQ0FBdUYsR0FBRyxFQUFFLE9BQUYsQ0FBVSxTQUFTLENBQVQsQ0FBVyxDQUFDLE1BQU8sR0FBRSxDQUFGLENBQUssQ0FBbEMsQ0FBb0MsQ0FBbEosQ0FBbUosR0FBRyxTQUFXLENBQVgsQ0FBYSxDQUFDLEdBQUksR0FBRSxFQUFFLFVBQVUsTUFBWixFQUFtQyxJQUFLLEVBQXBCLGFBQVUsQ0FBVixDQUFwQixDQUEwQyxVQUFVLENBQVYsQ0FBMUMsQ0FBdUQsSUFBN0QsQ0FBa0UsSUFBSSxFQUFFLENBQUYsRUFBSyxFQUFFLENBQUYsR0FBTSxDQUFDLFFBQUQsQ0FBWCxDQUFzQixFQUFFLENBQUYsRUFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixDQUFoQixDQUExQixDQUE4QyxDQUFwUixDQUFkLENBQXFTLEM7OztBQ0E1bkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IG92ZXJ1bmRlciBmcm9tICcuLi9wYWNrYWdlL2luZGV4LmpzJ1xuXG5jb25zdCBzY3JvbGxlciA9IG92ZXJ1bmRlci5zY3JvbGwoMTAwMCwgMjAwMCwge3dhdGNoUmVzaXplOiB0cnVlfSlcblxud2luZG93LnNjcm9sbGVyID0gc2Nyb2xsZXJcblxuc2Nyb2xsZXIub24oJ3VuZGVyJywgKCkgPT4gY29uc29sZS5sb2coJ3VuZGVyJykpXG5zY3JvbGxlci5vbignYmV0d2VlbicsICgpID0+IGNvbnNvbGUubG9nKCdiZXR3ZWVuJykpXG5zY3JvbGxlci5vbignb3ZlcicsICgpID0+IGNvbnNvbGUubG9nKCdvdmVyJykpXG4iLCJpbXBvcnQgc3JyYWYgZnJvbSAnc3JyYWYnXG5pbXBvcnQgbG9vcCBmcm9tICdsb29wLmpzJ1xuXG5jb25zdCBpc09iaiA9IG8gPT4gbyAhPT0gbnVsbCAmJiAnb2JqZWN0JyA9PT0gdHlwZW9mIG8gJiYgISgnbm9kZVR5cGUnIGluIG8pXG5cbmNvbnN0IG1lcmdlID0gKHRhcmdldCwgLi4uYXJncykgPT4gYXJncy5yZWR1Y2UoKHRhcmdldCwgYXJnKSA9PiB7XG4gIE9iamVjdC5rZXlzKGFyZykuZm9yRWFjaChrID0+IHRhcmdldFtrXSA9IGFyZ1trXSlcbiAgcmV0dXJuIHRhcmdldFxufSwgdGFyZ2V0KVxuXG5jb25zdCBtZXJnZU9wdGlvbnMgPSAodGFyZ2V0LCBwcm9wKSA9PiB7XG4gIGlzT2JqKHByb3ApID8gbWVyZ2UodGFyZ2V0LmNvbmZpZywgcHJvcCkgOiB0YXJnZXRbJ3JhbmdlJ10gPSBwcm9wXG59XG5cbmNvbnN0IGdldERpbWVuc2lvbnMgPSAoZWwsIHR5cGUpID0+IGVsLndpbmRvdyA/IChcbiAgTWF0aC5tYXgoZWxbYG91dGVyJHt0eXBlfWBdLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbYGNsaWVudCR7dHlwZX1gXSlcbikgOiAoXG4gIE1hdGgubWF4KGVsW2BvZmZzZXQke3R5cGV9YF0sIGVsW2BjbGllbnQke3R5cGV9YF0pXG4pXG5cbmNsYXNzIE92ZXJ1bmRlciB7XG4gIGNvbnN0cnVjdG9yKHR5cGUsIGRlbHRhLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgY29udGV4dDogd2luZG93LFxuICAgICAgb2Zmc2V0OiAwLFxuICAgICAgbmVnYXRpdmVPZmZzZXQ6IDAsXG4gICAgICB3YXRjaFJlc2l6ZTogZmFsc2UsXG4gICAgICBlbnRlckJvdHRvbTogZmFsc2VcbiAgICB9XG5cbiAgICB0aGlzLmRlbHRhID0gZGVsdGFcblxuICAgIG1lcmdlKHRoaXMsIGxvb3AoKSlcblxuICAgIGFyZ3MuZm9yRWFjaChhID0+ICEhYSA/IG1lcmdlT3B0aW9ucyh0aGlzLCBhKSA6IG51bGwpXG5cbiAgICBpZiAodGhpcy5jb25maWcud2F0Y2hSZXNpemUpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIgPSBzcnJhZi51c2UoKHsgY3VyclksIHByZXZZLCBjdXJyWCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5jb25maWcuY29udGV4dCA/IChcbiAgICAgICAgICBnZXREaW1lbnNpb25zKHRoaXMuY29uZmlnLmNvbnRleHQpXG4gICAgICAgICkgOiBjdXJyWFxuICAgICAgICB0aGlzLmN1cnJlbnRQb3NpdGlvbiA9IHRoaXMuY29uZmlnLnR5cGUgPT09ICdzY3JvbGwnID8gY3VyclkgOiB3aWR0aFxuXG4gICAgICAgIHRoaXMuY2hlY2tQb3NpdGlvbigpXG4gICAgICB9KS51cGRhdGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxpc3RlbmVyID0gc3JyYWZbdGhpcy5jb25maWcudHlwZSA9PT0gJ3Njcm9sbCcgPyAnc2Nyb2xsJyA6ICdyZXNpemUnXS51c2UoKHsgY3VyciB9KSA9PiB7XG4gICAgICAgIHRoaXMuY3VycmVudFBvc2l0aW9uID0gdGhpcy5jb25maWcuY29udGV4dCA/IChcbiAgICAgICAgICBnZXREaW1lbnNpb25zKHRoaXMuY29uZmlnLmNvbnRleHQsICdXaWR0aCcpXG4gICAgICAgICkgOiBjdXJyXG5cbiAgICAgICAgdGhpcy5jaGVja1Bvc2l0aW9uKClcbiAgICAgIH0pLnVwZGF0ZSgpXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmxpc3RlbmVyLmRlc3Ryb3koKVxuICB9XG5cbiAgdXBkYXRlKGRlbHRhID0gbnVsbCwgLi4uYXJncykge1xuICAgIC8qKlxuICAgICAqIGRlbHRhIHBhcmFtIGNvdWxkIGJlIG9iaiBvclxuICAgICAqIGp1c3QgYSBkZWx0YSB2YWx1ZVxuICAgICAqL1xuICAgIGlmIChkZWx0YSl7XG4gICAgICBpc09iaihkZWx0YSkgPyBtZXJnZU9wdGlvbnModGhpcywgZGVsdGEpIDogdGhpcy5kZWx0YSA9IGRlbHRhXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIG9wdGlvbmFsIHByb3BzIHRvIGluc3RhbmNlIG9iamVjdFxuICAgICAqL1xuICAgIGFyZ3MuZm9yRWFjaChhID0+ICEhYSA/IG1lcmdlT3B0aW9ucyh0aGlzLCBhKSA6IG51bGwpXG5cbiAgICB0aGlzLmNoZWNrUG9zaXRpb24odHJ1ZSlcbiAgfVxuXG4gIGNoZWNrUG9zaXRpb24oZm9yY2UgPSBmYWxzZSkge1xuICAgIC8qKlxuICAgICAqIERlbHRhIGFuZCByYW5nZSB2YWx1ZXNcbiAgICAgKi9cbiAgICBsZXQgZGVsdGEgPSB0aGlzLmRlbHRhXG4gICAgbGV0IHJhbmdlID0gdGhpcy5yYW5nZVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzLmRlbHRhID09PSAnb2JqZWN0Jyl7XG4gICAgICBkZWx0YSA9IHRoaXMuY29uZmlnLnR5cGUgPT09ICdzY3JvbGwnID8gKFxuICAgICAgICBkZWx0YS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB0aGlzLmN1cnJlbnRQb3NpdGlvblxuICAgICAgKSA6IChcbiAgICAgICAgcmV0dXJuU2l6ZSh0aGlzLmRlbHRhLCAnV2lkdGgnKVxuICAgICAgKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZSA9PT0gJ29iamVjdCcpe1xuICAgICAgcmFuZ2UgPSB0aGlzLmNvbmZpZy50eXBlID09PSAnc2Nyb2xsJyA/IChcbiAgICAgICAgdGhpcy5yYW5nZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB0aGlzLmN1cnJlbnRQb3NpdGlvblxuICAgICAgKSA6IChcbiAgICAgICAgcmV0dXJuU2l6ZSh0aGlzLnJhbmdlLCAnV2lkdGgnKSB8fCBmYWxzZVxuICAgICAgKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9mZnNldCB2YWx1ZXNcbiAgICAgKi9cbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5jb25maWcub2Zmc2V0IHx8IG51bGxcbiAgICBsZXQgbmVnYXRpdmVPZmZzZXQgPSB0aGlzLmNvbmZpZy5uZWdhdGl2ZU9mZnNldCB8fCBudWxsXG5cbiAgICBpZiAodHlwZW9mIHRoaXMub2Zmc2V0ID09PSAnb2JqZWN0Jyl7XG4gICAgICBvZmZzZXQgPSByZXR1cm5TaXplKHRoaXMub2Zmc2V0LCB0aGlzLmNvbmZpZy50eXBlID09PSAnc2Nyb2xsJyA/ICdIZWlnaHQnIDogJ1dpZHRoJylcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXMubmVnYXRpdmVPZmZzZXQgPT09ICdvYmplY3QnKXtcbiAgICAgIG5lZ2F0aXZlT2Zmc2V0ID0gcmV0dXJuU2l6ZSh0aGlzLm5lZ2F0aXZlT2Zmc2V0LCB0aGlzLmNvbmZpZy50eXBlID09PSAnc2Nyb2xsJyA/ICdIZWlnaHQnIDogJ1dpZHRoJylcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYWxjdWxhdGUgZmluYWwgZGVsdGEgYW5kIHJhbmdlIHZhbHVlc1xuICAgICAqL1xuICAgIGNvbnN0IHZpZXdwb3J0ID0gd2luZG93LmlubmVySGVpZ2h0IFxuICAgIGRlbHRhID0gZGVsdGEgLSBvZmZzZXQgKyBuZWdhdGl2ZU9mZnNldCAtIHZpZXdwb3J0XG4gICAgcmFuZ2UgPSByYW5nZSA/IHJhbmdlIC0gb2Zmc2V0ICsgbmVnYXRpdmVPZmZzZXQgLSB2aWV3cG9ydCA6IGZhbHNlXG5cbiAgICAvKipcbiAgICAgKiBCb29sZWFuc1xuICAgICAqL1xuICAgIGNvbnN0IG5vdFVuZGVyID0gdGhpcy5wb3NpdGlvbiAhPT0gJ3VuZGVyJ1xuICAgIGNvbnN0IG5vdE92ZXIgPSB0aGlzLnBvc2l0aW9uICE9PSAnb3ZlcidcbiAgICBjb25zdCBub3RCZXR3ZWVuID0gdGhpcy5wb3NpdGlvbiAhPT0gJ2JldHdlZW4nXG5cbiAgICBjb25zdCB1bmRlckRlbHRhID0gdGhpcy5jdXJyZW50UG9zaXRpb24gPCBkZWx0YVxuICAgIGNvbnN0IG92ZXJEZWx0YSA9IHRoaXMuY3VycmVudFBvc2l0aW9uID49IGRlbHRhXG5cbiAgICBjb25zdCB1bmRlclJhbmdlID0gdGhpcy5jdXJyZW50UG9zaXRpb24gPCByYW5nZVxuICAgIGNvbnN0IG92ZXJSYW5nZSA9IHRoaXMuY3VycmVudFBvc2l0aW9uID49IHJhbmdlXG5cbiAgICAvKipcbiAgICAgKiBGaW5hbCBib29sZWFuc1xuICAgICAqL1xuICAgIGNvbnN0IHVuZGVyID0gdW5kZXJEZWx0YSAmJiBub3RVbmRlclxuICAgIGNvbnN0IG92ZXIgPSByYW5nZSA/IG92ZXJSYW5nZSAmJiBub3RPdmVyIDogb3ZlckRlbHRhICYmIG5vdE92ZXJcbiAgICBjb25zdCBiZXR3ZWVuID0gcmFuZ2UgJiYgb3ZlckRlbHRhICYmIHVuZGVyUmFuZ2UgJiYgbm90QmV0d2VlblxuICAgIGNvbnN0IHVuZGVyRm9yY2UgPSB1bmRlckRlbHRhICYmIGZvcmNlXG4gICAgY29uc3Qgb3ZlckZvcmNlID0gcmFuZ2UgPyBvdmVyUmFuZ2UgJiYgZm9yY2UgOiBvdmVyRGVsdGEgJiYgZm9yY2VcbiAgICBjb25zdCBiZXR3ZWVuRm9yY2UgPSByYW5nZSAmJiBvdmVyRGVsdGEgJiYgdW5kZXJSYW5nZSAmJiBmb3JjZVxuXG4gICAgaWYgKHVuZGVyIHx8IHVuZGVyRm9yY2Upe1xuICAgICAgdGhpcy5wb3NpdGlvbiA9ICd1bmRlcidcbiAgICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoYmV0d2VlbiB8fCBiZXR3ZWVuRm9yY2Upe1xuICAgICAgdGhpcy5wb3NpdGlvbiA9ICdiZXR3ZWVuJyBcbiAgICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0aGlzKVxuICAgIH0gZWxzZSBpZiAob3ZlciB8fCBvdmVyRm9yY2Upe1xuICAgICAgdGhpcy5wb3NpdGlvbiA9ICdvdmVyJyBcbiAgICAgIHRoaXMuZW1pdCh0aGlzLnBvc2l0aW9uLCB0aGlzKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNjcm9sbChkZWx0YSwgcmFuZ2UsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IE92ZXJ1bmRlcignc2Nyb2xsJywgZGVsdGEsIHJhbmdlLCBvcHRpb25zKVxuICB9LFxuICByZXNpemU6IChkZWx0YSwgcmFuZ2UsIG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gbmV3IE92ZXJ1bmRlcigncmVzaXplJywgZGVsdGEsIHJhbmdlLCBvcHRpb25zKVxuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjt2YXIgX2V4dGVuZHM9T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24oYSl7Zm9yKHZhciBjLGI9MTtiPGFyZ3VtZW50cy5sZW5ndGg7YisrKWZvcih2YXIgZCBpbiBjPWFyZ3VtZW50c1tiXSxjKU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjLGQpJiYoYVtkXT1jW2RdKTtyZXR1cm4gYX07T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSk7ZXhwb3J0cy5kZWZhdWx0PWZ1bmN0aW9uKCl7dmFyIGE9MDxhcmd1bWVudHMubGVuZ3RoJiZhcmd1bWVudHNbMF0hPT12b2lkIDA/YXJndW1lbnRzWzBdOnt9LGI9e307cmV0dXJuIF9leHRlbmRzKHt9LGEse2VtaXQ6ZnVuY3Rpb24gZChmKXt2YXIgZz0xPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1sxXSE9PXZvaWQgMD9hcmd1bWVudHNbMV06bnVsbCxoPSEhYltmXSYmYltmXS5xdWV1ZTtoJiZoLmZvckVhY2goZnVuY3Rpb24oail7cmV0dXJuIGooZyl9KX0sb246ZnVuY3Rpb24gYyhmKXt2YXIgZz0xPGFyZ3VtZW50cy5sZW5ndGgmJmFyZ3VtZW50c1sxXSE9PXZvaWQgMD9hcmd1bWVudHNbMV06bnVsbDtnJiYoYltmXT1iW2ZdfHx7cXVldWU6W119LGJbZl0ucXVldWUucHVzaChnKSl9fSl9OyIsIid1c2Ugc3RyaWN0Jzt2YXIgX2NyZWF0ZUNsYXNzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShiLGMpe2Zvcih2YXIgZixkPTA7ZDxjLmxlbmd0aDtkKyspZj1jW2RdLGYuZW51bWVyYWJsZT1mLmVudW1lcmFibGV8fCExLGYuY29uZmlndXJhYmxlPSEwLCd2YWx1ZSdpbiBmJiYoZi53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KGIsZi5rZXksZil9cmV0dXJuIGZ1bmN0aW9uKGIsYyxkKXtyZXR1cm4gYyYmYShiLnByb3RvdHlwZSxjKSxkJiZhKGIsZCksYn19KCk7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsJ19fZXNNb2R1bGUnLHt2YWx1ZTohMH0pO2Z1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhhLGIpe2lmKCEoYSBpbnN0YW5jZW9mIGIpKXRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvbicpfXZhciBzY3JvbGxJbnN0YW5jZT1udWxsLHJlc2l6ZUluc3RhbmNlPW51bGwsTGlzdGVuZXI9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGIpe19jbGFzc0NhbGxDaGVjayh0aGlzLGEpLHRoaXMudHlwZT1iLHRoaXMucG9vbD0wLHRoaXMucXVldWU9W10sdGhpcy5jdXJyPXRoaXMucG9zaXRpb24oKSx0aGlzLnByZXY9dGhpcy5wb3NpdGlvbigpLHRoaXMudGlja2luZz0hMSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihiLHRoaXMucmVxdWVzdEZyYW1lLmJpbmQodGhpcykpfXJldHVybiBfY3JlYXRlQ2xhc3MoYSxbe2tleToncG9zaXRpb24nLHZhbHVlOmZ1bmN0aW9uIHBvc2l0aW9uKCl7cmV0dXJuJ3Njcm9sbCc9PT10aGlzLnR5cGU/d2luZG93LnNjcm9sbFl8fHdpbmRvdy5wYWdlWU9mZnNldDp3aW5kb3cuaW5uZXJXaWR0aH19LHtrZXk6J3JlcXVlc3RGcmFtZScsdmFsdWU6ZnVuY3Rpb24gcmVxdWVzdEZyYW1lKGIpe3RoaXMuZT1iLHRoaXMuY3Vycj10aGlzLnBvc2l0aW9uKCksdGhpcy50aWNraW5nfHwod2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnJ1bi5iaW5kKHRoaXMpKSx0aGlzLnRpY2tpbmc9ITApfX0se2tleToncnVuJyx2YWx1ZTpmdW5jdGlvbiBydW4oKXt2YXIgYj10aGlzO3RoaXMucXVldWUuZm9yRWFjaChmdW5jdGlvbihjKXtyZXR1cm4gY1sxXSh7Y3VycjpiLmN1cnIscHJldjpiLnByZXZ9LGIuZSl9KSx0aGlzLnByZXY9dGhpcy5jdXJyLHRoaXMudGlja2luZz0hMX19LHtrZXk6J3VzZScsdmFsdWU6ZnVuY3Rpb24gdXNlKGIpe3ZhciBjPXRoaXMsZD1jLnBvb2wrKztyZXR1cm4gYy5xdWV1ZS5wdXNoKFtkLGJdKSx7ZGVzdHJveTpmdW5jdGlvbiBkZXN0cm95KCl7cmV0dXJuIGMucXVldWUuZm9yRWFjaChmdW5jdGlvbihmLGcpe2ZbMF09PT1kJiZjLnF1ZXVlLnNwbGljZShnLDEpfSksdGhpc30sdXBkYXRlOmZ1bmN0aW9uIHVwZGF0ZSgpe3JldHVybiBiKHtjdXJyOmMuY3VycixwcmV2OmMucHJldn0sYy5lKSx0aGlzfX19fSx7a2V5Oid1cGRhdGUnLHZhbHVlOmZ1bmN0aW9uIHVwZGF0ZSgpe3RoaXMucnVuKCl9fV0pLGF9KCk7ZXhwb3J0cy5kZWZhdWx0PSd1bmRlZmluZWQnPT10eXBlb2Ygd2luZG93P251bGw6e2dldCBzY3JvbGwoKXtyZXR1cm4gc2Nyb2xsSW5zdGFuY2V8fChzY3JvbGxJbnN0YW5jZT1uZXcgTGlzdGVuZXIoJ3Njcm9sbCcpKSxzY3JvbGxJbnN0YW5jZX0sZ2V0IHJlc2l6ZSgpe3JldHVybiByZXNpemVJbnN0YW5jZXx8KHJlc2l6ZUluc3RhbmNlPW5ldyBMaXN0ZW5lcigncmVzaXplJykpLHJlc2l6ZUluc3RhbmNlfSx1c2U6ZnVuY3Rpb24gdXNlKGEpe3ZhciBfc2Nyb2xsPXRoaXMuc2Nyb2xsLGI9X3Njcm9sbC5jdXJyLGM9X3Njcm9sbC5wcmV2LF9yZXNpemU9dGhpcy5yZXNpemUsZD1fcmVzaXplLmN1cnIsZj1fcmVzaXplLnByZXYsZz17Y3Vyclk6YixwcmV2WTpjLGN1cnJYOmQscHJldlg6Zn0saD10aGlzLnNjcm9sbC51c2UoZnVuY3Rpb24oX3JlZixtKXt2YXIgaz1fcmVmLmN1cnIsbD1fcmVmLnByZXY7Zy5jdXJyWT1rLGcucHJldlk9bCxhKGcsbSl9KSxqPXRoaXMucmVzaXplLnVzZShmdW5jdGlvbihfcmVmMixtKXt2YXIgaz1fcmVmMi5jdXJyLGw9X3JlZjIucHJldjtnLmN1cnJYPWssZy5wcmV2WD1sLGEoZyxtKX0pO3JldHVybntkZXN0cm95OmZ1bmN0aW9uIGRlc3Ryb3koKXtyZXR1cm4gaC5kZXN0cm95KCksai5kZXN0cm95KCksdGhpc30sdXBkYXRlOmZ1bmN0aW9uIHVwZGF0ZSgpe3JldHVybiBoLnVwZGF0ZSgpLGoudXBkYXRlKCksdGhpc319fX07Il19
