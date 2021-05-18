import { generate } from './codegen/index';
import { parseHTML } from './parse'; 

export function compileToFunctions(template) {
  // 先将模板解析成AST， 再使用AST生成渲染函数
  let ast = parseHTML(template)

  // 可以获取渲染函数code = { render: xxx,  staticRenderFns: yyy}
  let code = generate(ast)
}