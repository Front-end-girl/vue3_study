// runtime-dom 操作dom 1) 节点 2）节点属性
import { extend } from "@vue/shared";
// 操作节点
import { nodeOps } from "./nodeOps";
// patch 对比定义属性 事件
import { patchProps } from "./patchProp";

import { createRender } from "@vue/runtime-core";

// vue3的dom全部操作

const renderOptionDom = extend({ patchProps }, nodeOps);

// createApp、

export const createApp = (rootComponent, rootProps) => {
  // 渲染  高阶函数 创建渲染器
  let app: any = createRender(renderOptionDom).createApp(
    // 高阶函数
    rootComponent,
    rootProps
  );
  let { mount } = app;

  app.mount = function (container) {
    // 挂载组件
    // 清空自己内容
    container = nodeOps.querySelecter(container);
    container.innerHTML = "";
    // 将组件渲染到dom
    mount(container);
  };
  return app;
};
export { renderOptionDom };


const strategies = {
  "high": function (workHours) {
      return workHours * 25
  },
  "middle": function (workHours) {
      return workHours * 20
  },
  "low": function (workHours) {
      return workHours * 15
  },
}

const calculateSalary = function (workerLevel, workHours) {
  return strategies[workerLevel](workHours)
}
console.log(calculateSalary('high', 10)) // 250
console.log(calculateSalary('middle', 10)) // 200
