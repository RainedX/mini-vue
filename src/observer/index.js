import { def, hasProto, isObject } from "../utils/index";
import { arrayMethods } from './array'

// 方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

function protoAugment(target, src) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0, len = keys.length; i < len; i++) {
    def(target, keys[i], src[keys[i]])
  }
}

export class Observer {
  constructor(value) {
    this.value = value
    def(value, '__ob__', this)

    // value可能是对象或者是数组，为了性能考虑，数组单独处理不用defineProperty
    if (Array.isArray(value)) {
      // 重新数组方法：push、pop、shift、unshift、sort、reverse、splice
      const augment = hasProto ? protoAugment : copyAugment

      // value.__proto__ = arrayMethods
      protoAugment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

  walk(obj) {
    const keys = Object.keys(obj)
    for (let i = 0, len = keys.length; i < len; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}

export function observe(value) {
  if (!isObject(value)) {
    return
  }

  let ob;

  ob = new Observer(value)

  return ob
}

export function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return val
    },
    set(newVal) {
      if (newVal === val) return
      // 手动设置 vm.info = { age: 12 }
      observe(newVal)
      val = newVal
    }
  })
}