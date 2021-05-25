import { mergeOptions } from '../utils/options';
let cid = 0;

export function initGlobalAPI(Vue) {
  Vue.options = {}; // 用来存储全局配额
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
  Vue.options._base = Vue; // Vue的构造函数
  Vue.options.components = {}; // 存放组件的定义
  Vue.component = function (id, definition) {
    definition.name = definition.name || id;
    // 通过对象产生一个构造函数
    definition = this.options._base.extend(definition);
    this.options.components[id] = definition;
    return definition;
  };
  Vue.extend = function (extendOptions) {
    const Super = this;
    const Sub = function VueComponent(extendOptions) {
      this._init(extendOptions);
    };
    Sub.options = mergeOptions(Super.options, extendOptions);
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;

    Sub.extend = Super.extend;
    Sub.component = Super.component;

    return Sub;
  };
}
