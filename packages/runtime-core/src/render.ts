import { ShapeFlags } from "@vue/shared";
import { ApiCreateApp } from "./apiCreateApp";
import {
  createComponentInstance,
  setupComponent,
  setupRenderEffect,
} from "./component";
// 渲染 放在 runtime-core
export function createRender(renderOptionDom) {
  const mountComponent = (initialVnode, container) => {
    // 组件的渲染流程 核心

    // 1. 先有一个组件的实例对象 render(proxy)  是 rootComponent
    const instance = (initialVnode.component =
      createComponentInstance(initialVnode));

    // 2. 解析数据到这个实现对象
    setupComponent(instance);
    // 3. 创建一个effect 让render函数执行
    setupRenderEffect();
  };
  // 组件创建
  const processComponent = (n1, n2, container) => {
    if (n1 === null) {
      // 第一次渲染
      mountComponent(n2, container);
    } else {
      //更新
    }
  };
  /**
   *
   * @param n1 上一个虚拟节点
   * @param n2  当前虚拟节点
   * @param container 容器
   */
  const patch = (n1, n2, container) => {
    // 针对不同类型  1  组件 2 元素
    let { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) {
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      processComponent(n1, n2, container);
    }
  };
  // 实现渲染
  let render = (vnode, container) => {
    // 虚拟dom渲染成真实dom
    // 渲染 第一次
    patch(null, vnode, container); // 原来虚拟对象 现在虚拟对象 容器
  };
  return {
    createApp: ApiCreateApp(render),
  };
}
// 1. 创建createApp 方法 => mount方法 （创建渲染器）-创建虚拟节点
