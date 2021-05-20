let uid = 0
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.cb = cb;
    if (this.options) {
      //
    }
    this.id = ++uid
    this.expOrFn();
  }
}

export default Watcher