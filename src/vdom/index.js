function simpleNormalizeChildren(children) {
  for (let i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children);
    }
  }
  return children;
}

function createComponent(vm, tag, data, key, children, Ctor) {
  let baseCtor = vm.$options._base;
  if (typeof Ctor === 'object') {
    Ctor = baseCtor.extend(Ctor)
  }

  data.hook = {
    init(vnode) {
     let child = vnode.componentInstance = new vnode.componentOption.Ctor({});
     child.$mount()
    }
  }

  return vnode(`vue-component-${Ctor.cid}`, data, key, undefined, undefined, {Ctor})
}

export function createElement(vm, tag, data = {}, ...children) {
  let key = data.key;
  if (key) {
    delete data.key;
  }
  if (isReservedTag(tag)) {
    return vnode(tag, data, key, simpleNormalizeChildren(children), undefined, undefined);
  } else {
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, key, children, Ctor)
  }
  
}
export function createTextNode(text) {
  return vnode(undefined, undefined, undefined, undefined, text, undefined);
}

function vnode(tag, data, key, children, text, componentOption) {
  return {
    tag,
    data,
    key,
    children,
    text,
    componentOption
  };
}

function makeMap(str, expectsLowerCase) {
  const map = Object.create(null);
  const list = str.split(',');

  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }

  return expectsLowerCase ? (val) => map[val.toLowerCase()] : (val) => map[val];
}

const isReservedTag = makeMap(
  'template,script,style,element,content,slot,link,meta,svg,view,' +
    'a,p,li,ul,button,div,img,image,text,span,input,switch,textarea,spinner,select,' +
    'slider,slider-neighbor,indicator,canvas,' +
    'list,cell,header,loading,loading-indicator,refresh,scrollable,scroller,' +
    'video,web,embed,tabbar,tabheader,datepicker,timepicker,marquee,countdown',
  true,
);
