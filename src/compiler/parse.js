// 当使用构造函数创造正则对象时，需要常规的字符转义规则（在前面加反斜杠 \）
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;

// 开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;

// 结束标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
const comment = /^<!--/; 
const conditionalComment = /^<!\[/;

let root;
let currentParent;
let stack = [];

const ELEMENT_TYPE = 1; // 元素类型
const TEXT_TYPE = 3;

function createASTElement(tagName, attrs) {
  return {
    tag: tagName,
    type: ELEMENT_TYPE,
    children: [],
    attrs,
    parent: null
  }
}

export function parseHTML(html) {
  // 根据开始标签、结束标签、文本内容生成一个AST语法树
  function start(tagName, attrs) {
    let element = createASTElement(tagName, attrs)
    if (!root) {
      root = element
    }
    currentParent = element
    stack.push(element)
  }

  function end(tagName) {
    let element = stack.pop()
    currentParent = stack[stack.length - 1]

    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
  }

  function chars(text) {
    text = text.trim()

    if (text) {
      currentParent.children.push({
        type: TEXT_TYPE,
        text
      })
    }
  }


  function advance(n) {
    html = html.substring(n)
  }
  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }

      advance(start[0].length)

      let attr, end = html.match(startTagClose);

      // 匹配到的不是 > 标签
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || ''
        })
      }

      if (end) {
        advance(end[0].length)
        return match
      }
    }
  }

  while (html) {
    let textEnd = html.indexOf('<')
    
    if (textEnd === 0) {
      const startTagMatch = parseStartTag();
      // 开始标签
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      }

      // 结束标签
      let endTagMatch = html.match(endTag)
      
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
      }
    }

    let text;
    // 开始解析文本
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
      if (text) {
        advance(text.length)
        chars(text)
      }
    }
  }

  return root
}