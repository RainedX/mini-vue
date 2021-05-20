import Watcher from "./observer/watcher"
import { patch } from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {
    const vm = this;
    const prevVnode = vm._vnode;

    if (!prevVnode) {
      vm.$el = patch(vm.$el, vnode)
    } else {
      vm.$el = patch(prevVnode, vnode)
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