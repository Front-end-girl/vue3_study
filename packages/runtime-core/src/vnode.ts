// 创建虚拟节点
// 注意：createVnode= h('div',{style:{color:'red'},'hello',[儿子]}) createVnode和h函数作用一样
// 1.区分 是组件<div></div>还是元素h
// 2. 创建vnode
import { isArray, isObject, isString, ShapeFlags } from "@vue/shared";
export function createVnode(type, props, children = null) {
  // vnode {}
  let shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0; // 如果是字符串 则是文本类型 如果是对象 则是 组件类型
  const vnode = {
    _v_isVnode: true, // 表示一个虚拟节点
    type,
    props,
    children,
    key: props && props.key, // diff 会用到
    el: null, // 和真实的元素和vnode对应
    component: null, // 组件实例对象
    shapeFlag,
  };
  // 儿子标识
  // createVnode= h('div',{style:{color:'red'},'hello',[儿子]})
  normalizeChildren(vnode, children); // 解析儿子
  return vnode;
}
function normalizeChildren(vnode, children) {
  let type = 0;
  if (children == null) {
    // const vnode = h("div", [
    //   h("h1", "Hello, Vue 3!"),
    //   h("p", "Welcome to Vue 3."),
    //   h("button", "Click me")
    // ]);
  } else if (isArray(children)) {
    // 如果是数组
    type = ShapeFlags.ARRAY_CHILDREN;
  } else {
    type = ShapeFlags.TEXT_CHILDREN;
  }

  // 节点标识 与子节点标识结合
  vnode.shapeFlag = vnode.shapeFlag | type;
}
