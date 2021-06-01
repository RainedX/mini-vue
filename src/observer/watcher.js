import { popTarget, pushTarget } from './dep';
import { queueWatcher } from './scheduler';

let uid = 0;
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.deps = [];
    this.depIds = new Set();
    if (options) {
      this.lazy = options.lazy; // computed
      this.user = !!options.user // 用户watcher
      this.sync = !!options.sync // 同步watcher
    }
    this.dirty = this.lazy
    this.id = ++uid;
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = function () {
        let path = expOrFn.split('.');
        let obj = vm;

        for (let i = 0; i < path.length; i++) {
            obj = obj[path[i]]
        }
        return obj;
      }
    }
    this.value = this.lazy ? undefined : this.get();
  }
  get() {
    pushTarget(this);
    let value = this.getter.call(this.vm);
    popTarget();

    return value;
  }
  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this)
    }
  }
  evaluate() {
    this.dirty = false;
    this.value = this.get();
  }
  run() {
    let oldValue = this.value;
    let newValue = this.get();
    this.value = newValue;

    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
    // this.get()
  }

  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }

  // 当属性取值时，需要记住和此属性相关的watcher，当数据发生变化后，去执行自己的watcher
}

export default Watcher;
