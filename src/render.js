import { nextTick } from './utils/next-tick';
import { createElement, createTextNode } from './vdom/index';

export function renderMixin(Vue) {
  Vue.prototype._c = function (...args) {
    return createElement(this, ...args);
  };
  Vue.prototype._s = function (val) {
    return val === null
      ? ''
      : typeof val === 'object'
      ? JSON.stringify(val)
      : val;
  };
  Vue.prototype._v = function (text) {
    return createTextNode(text);
  };
  Vue.prototype._l = function (val, render) {
    let ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
    return ret;
  };
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  }
  Vue.prototype._render = function () {
    const vm = this;
    const { render } = vm.$options;
    let vnode = render.call(vm);
    return vnode;
  };
}
