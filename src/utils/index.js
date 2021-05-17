const _toString = Object.prototype.toString;

export const def = function (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export const hasProto = '__proto__' in {}

export function noop() {}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

export function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

export function isUndef(v) {
  return v === undefined || v === null;
}

export function isDef(v) {
  return v !== undefined && v !== null;
}

export function isTrue(v) {
  return v === true;
}

export function isFalse(v) {
  return v === false;
}

export function isPrimitive(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}
