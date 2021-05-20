function simpleNormalizeChildren (children) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

export function createElement(tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key;
  }
  return vnode(tag, data, key, simpleNormalizeChildren(children));
}
export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text);
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text,
  };
}
