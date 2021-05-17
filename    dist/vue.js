(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      console.log(1111, options);
    };
  }

  function Vue(options) {
    this._init(options); // new Vue时调用init方法，进行初始化操作

  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
