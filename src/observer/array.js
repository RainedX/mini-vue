import { def } from '../utils/index';

const arrayProto = Array.prototype;

// Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
export const arrayMethods = Object.create(arrayProto);

let methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

methods.forEach(function (method) {
  const original = arrayProto[method];

  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);

    let inserted;

    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }

    if (inserted) this.__ob__.observeArray(inserted)

    return result;
  });
});
