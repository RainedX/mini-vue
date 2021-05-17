import { initMixin } from "./init";

function Vue(options) { 
  this._init(options); // new Vue时调用init方法，进行初始化操作
}

initMixin(Vue)

export default Vue