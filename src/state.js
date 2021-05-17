import { observe } from './observer/index';
import { noop } from './utils/index';

export function initState(vm) {
  const opts = vm.$options;
  // if (opts.props) initProps(vm, opts.props)
  // if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm);
  } else {
    //
  }

  // if (opts.computed) initComputed(vm, opts.computed)
  // if (opts.watch) initWatch(vm, opts.watch)
}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initData(vm) {
  let data = vm.$options.data;
  // data类型判断
  data = vm._data = typeof data === 'function' ? data.call(vm) : data;

  const keys = Object.keys(data);
  let i = keys.length;

  // 为了方便取值， vm._data.username直接可以通过vm.username获取
  while (i--) {
    const key = keys[i];
    proxy(vm, '_data', key);
  }

  observe(data);
}
