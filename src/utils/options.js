import { hasOwn } from './index'

// 存储策略
const strats = {}
const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
]

function mergeHook (parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      if (Array.isArray(childVal)) {
        return childVal
      } else {
        return [childVal]
      }
    }
  } else {
    return parentVal
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})
strats.data = function (parentVal, childVal) {
    return childVal
}
strats.components = function () {}

const defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
}

export function mergeOptions (parent, child) {
  const options = {}
  let key

  for (key in parent) {
    mergeField(key)
  }

  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }

  function mergeField(key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key])
  }
  return options
}