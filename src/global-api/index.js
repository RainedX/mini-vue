import { mergeOptions } from '../utils/options';

export function initGlobalAPI(Vue) {
  Vue.options = {}; // 用来存储全局配额
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this;
  };
}
