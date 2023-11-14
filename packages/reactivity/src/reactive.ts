import { isObject } from "@vue/shared";
import {
  reactiveHandlers,
  shallowReactiveHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export function reactive(target: object) {
  return createReactive(target, false, reactiveHandlers);
}
export function shallowReactive(target: object) {
  return createReactive(target, false, shallowReactiveHandlers);
}
export function readonly(target: object) {
  return createReactive(target, false, readonlyHandlers);
}
export function shallowReadonly(target: object) {
  return createReactive(target, false, shallowReadonlyHandlers);
}
// 核心实现代理

// 数据结构 存贮已代理(性能优化重复代理)
const reactiveMap = new WeakMap(); // key必须是对象 自动会垃圾回收
const readonlyMap = new WeakMap();

function createReactive(target, isReadonly, baseHandlers) {
  //注意 proxy（） 对象 公共的方法 shared
  if (!isObject(target)) {
    return target;
  }
  // 核心 proxy
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const proxyEs = proxyMap.get(target);
  if (proxyEs) {
    return proxyEs;
  }
  // 问题，已经被代理不允许代理
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy); // 用于判断是否已经代理过
  return proxy;
}
