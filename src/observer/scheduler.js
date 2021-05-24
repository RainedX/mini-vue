import { nextTick } from "../utils/next-tick";

let has = {}
let queue = []

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    let watcher = queue[i]
    watcher.run();
  }

  queue = [];
  has = {};
  waiting = false;
}

let waiting = false;

export function queueWatcher(watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    queue.push(watcher)

    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue)
    }
  }
}