import { compileToFunctions } from "./compiler/index";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptions } from "./utils/options";

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    // vm.constructor不一定指向Vue，也可能是Vue.extend创造的子类
    vm.$options = mergeOptions(vm.constructor.options || {}, options);
    callHook(vm, 'beforeCreate')
    // 初始化状态
    initState(vm);
    callHook(vm, 'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)

    const vm = this;
    const options = vm.$options;
    // 有render就直接用render
    // 没有render就看有没有template
    // 没有template，就找外部模板

    if (!options.render) {
      let template = options.template;

      if (!template && el) {
        template = el.outerHTML;
      }

      const render = compileToFunctions(template)
      options.render = render;
    }

    // 组件挂载
    mountComponent(vm, el)
  }
}