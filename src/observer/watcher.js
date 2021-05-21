import { popTarget, pushTarget } from './dep';

let uid = 0;
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.cb = cb;
    this.deps = [];
    this.depIds = new Set();
    if (this.options) {
      //
    }
    this.id = ++uid;
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    }

    this.get();
  }
  get() {
    pushTarget(this);
    this.getter();
    popTarget();
  }
  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
      dep.addSub(this)
    }
  }
  update() {
    this.get()
  }

  // 当属性取值时，需要记住和此属性相关的watcher，当数据发生变化后，去执行自己的watcher
}

export default Watcher;
