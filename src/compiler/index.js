import { generate } from './codegen/index';
import { parseHTML } from './parse';

export function compileToFunctions(template) {
  // 先将模板解析成AST， 再使用AST生成渲染函数
  let ast = parseHTML(template);

  // code: _c(div, {id:"app",style:{"color":" red"," background-color":" yellowgreen"}}_c(ul, _c(li, _v(_s(username)+" hello world  "+_s(age))),_c(li, _v("rained"))))
  let code = generate(ast);
  let render = `with(this){return ${code}}`;
  let fn = new Function(render);
  return fn;
}
