export function patch(oldVnode, vnode) {
  // 初次渲染的时候，oldVnode为真实dom元素
  const isRealElement = oldVnode.nodeType;

  if (isRealElement) {
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;

    // 根据vnode生成真实dom，替换old
    let el = createEle(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling);
    parentElm.removeChild(oldVnode);
    return el;
  }
}

function createEle(vnode) {
  let { tag, children, key, data, text } = vnode;

  // 普通标签
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach((child) => {
      vnode.el.appendChild(createEle(child));
    });
  } else {
    // 文本节点
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el;

  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if ((key = 'class')) {
      el.classNmae = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}
