import Dep from './observer/dep';
import { observe } from './observer/index';
import Watcher from './observer/watcher';
import { isObject, noop } from './utils/index';

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function initState(vm) {
  const opts = vm.$options;
  // if (opts.props) initProps(vm, opts.props)
  // if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm);
  } else {
    //
  }

  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch) initWatch(vm, opts.watch)
}

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

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }

      if (Dep.target) { // 计算属性在模板中使用 则存在Dep.target
        watcher.depend()
      }

      return watcher.value;
    }
  }
}

function defineComputed(target ,key, userDef) {
  // 需要添加缓存
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
  } else {
    sharedPropertyDefinition.get = ucreateComputedGetter(key);
    sharedPropertyDefinition.set = userDef.set || (() => {});
  }

  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initComputed(vm, computed) {
  const watchers = vm._computedWatchers = {};
  for(let key in computed) {
    const userDef = computed[key];
    // computed里面可能写的是getter和setter
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    watchers[key] = new Watcher(vm, getter, () => {}, { lazy: true })
    console.log('computed---watcher');
    defineComputed(vm, key, userDef);
  }
}

function initWatch(vm, watch) {
  for (let key in watch) {
    const handler = watch[key];

    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, hander[i])
      }
    } else {
      createWatcher(vm, key, handler)
    }
  }
}

function createWatcher(vm, key, handler, options) {
  if (isObject(handler)) {
    options = handler
    handler = handler.handler
  }
  // watcher ===> { handler: 'getName', sync: true }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }

  return vm.$watch(key, handler, options)
}

export function stateMixin (Vue) {
  Vue.prototype.$watch = function(exprOrFn, cb, options = {}) {
    const vm = this
    // 创建用户自定义的watcher
    options.user = true
    new Watcher(vm, exprOrFn, cb, options)
    console.log('custom---watcher');
  }
}