import { initGlobalAPI } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from './lifecycle'
import { renderMixin } from './render'

function Vue(options) { 
  this._init(options); // new Vue时调用init方法，进行初始化操作
}

initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
initGlobalAPI(Vue)

export default Vue