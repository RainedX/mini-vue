import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this;
    vm.$el = patch(vm.$el, vnode);
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]

  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm)
    }
  }
}

export function mountComponent(vm, el) {
  vm.$el = el
  // 默认vue是通过watcher来进行渲染的（渲染watcher，每一个组件都有一个渲染watcher）
  let updateComponent = () => {
    // vm_render生成vnode
    vm._update(vm._render())
  }

  new Watcher(vm, updateComponent, () => {}, true)
}