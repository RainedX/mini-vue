let callbacks = []
let pending = false

function flushCallbacks () {
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]()
  }

  pending = false
  callbacks = []
}

export function nextTick(cb, ctx) {
  callbacks.push(() => {
    cb.call(ctx)
  })

  if (!pending) {
    pending = true;
    Promise.resolve().then(flushCallbacks)
  }
}