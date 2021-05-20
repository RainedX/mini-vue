// _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

function genProps(attrs) {
  let str = '';

  for (let i = 0, len = attrs.length; i < len; i++) {
    let attr = attrs[i];

    if (attr.name === 'style') {
      let obj = {};

      attr.value.split(';').forEach((item) => {
        let [key, value] = item.split(':');
        obj[key] = value;
      });

      attr.value = obj;
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }

  return `{${str.slice(0, -1)}}`;
}

function gen(node) {
  if (node.type === 1) {
    return generate(node);
  } else {
    let text = node.text;

    // 匹配的是普通文本
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    }

    let lastIndex = (defaultTagRE.lastIndex = 0);
    let tokens = [];
    let match, index;

    // var reg = new RegExp(/ab/g);
    // 第一次：reg.exec("abcab") ===> ["ab", index: 0] lastIndex: 2
    // 第二次：reg.exec("abcab") ===> ["ab", index: 3] lastIndex: 5
    // 第三次：reg.exec("abcab") ===> null lastIndex: 0
    while ((match = defaultTagRE.exec(text))) {
      index = match.index;

      // {{username}}hello{{age}}匹配到中间的hello 此时index为17, lastIndex为上一次的12
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)));
      }

      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].length;
    }

    // 剩余的普通文本
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)));
    }

    return `_v(${tokens.join('+')})`;
  }
}

function genChildren(el) {
  let children = el.children;

  if (children) {
    return children.map((child) => gen(child)).join(',');
  } else {
    return false;
  }
}

function genFor(el) {
  const exp = el.for;
  const alias = el.alias;

  return (
    `_l((${exp}),` +
    `function(${alias}){` +
    `return _c('${el.tag}', ${el.attrs.length ? genProps(el.attrs) : 'undefined'}, ${genChildren(el)})` +
    '})'
  );
}

function genElement(el) {
  if (el.for) {
    return genFor(el);
  } else {
    const children = genChildren(el);
    return `_c('${el.tag}', ${el.attrs.length ? genProps(el.attrs) : 'undefined'}${children ? ',' + children : ''})`
  }
}
// "_c('div',{staticStyle:{"color":"red","background-color":"yellowgreen"},attrs:{"id":"app"}},[_c('ul',_l((arr),function(item){return _c('li',{staticClass:"item"},[_v(_s(item))])}),0)])"
export function generate(ast) {
  let code = genElement(ast);
  return code;
}
