import { ShapeFlags } from "@vue/shared";
import { componentPublicInstance } from "./componentPublicInstance";

// 1. 先有一个组件的实例对象 render(proxy)  是 rootComponent
export const createComponentInstance = (vnode) => {
  //就是一个对象
  const instance = {
    vnode,
    type: vnode.type, // 组件类型 元素、对象
    props: {}, // 组件的属性，
    attrs: {}, //
    setupState: {}, //setup返回值
    ctx: {}, // 代理 instance.props.name  要这样proxy.name
    proxy: {},
    isMounted: false, // 是否挂载
  };
  instance.ctx = {
    // 代理 ？？？？？？？？？？？？？？？？？？？？？
    _: instance,
  };
  return instance;
};
// 2. 解析数据到这个实现对象
export const setupComponent = (instance) => {
  // 设置值
  let { props, children } = instance.vnode;
  instance.props = props;
  instance.children = children;

  // 判断是否有setup
  let shapeFlag = instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT; ///  ??????????????????????? 上面已经判断 为什么还要判断
  // 是否是状态组件
  if (shapeFlag) {
    setupStateComponent(instance);
  }
};

function setupStateComponent(instance) {
  // 代理   这个很有意思
  instance.proxy = new Proxy(instance.ctx, componentPublicInstance as any);
  // setup 是对象还是 函数  参数（props,context）
  let Component = instance.type;
  let { setup } = instance.type;
  //   setup();
  // 处理参数
  let setupContext = createContext(instance);
  instance.setupState = setup(instance.props, setupContext);
  // 处理render
  Component.render(instance.proxy);
}

function createContext(instance) {
  return {
    attrs: instance.attrs,
    slots: instance.slots, // slots???????????????????????????????? 待确认
    emit: () => {},
    expose: () => {},
  };
}
// 3. 创建一个effect 让render函数执行
export const setupRenderEffect = () => {};

// 给组件创建一个instance 添加信息