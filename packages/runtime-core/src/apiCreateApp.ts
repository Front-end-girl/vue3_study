import { createVnode } from "./vnode";
// 创建vnode
export function ApiCreateApp(render) {
  // 告诉他是那个组件,那个属性
  return function (rootComponent, rootProps) {
    let app = {
      // 渲染之后 挂载方法
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount(container) {
        // 挂载位置
        // console.log(container, rootComponent, rootProps, renderOptionDom);
        // 创建vnode 根据组件创建虚拟节点

        let vnode = createVnode(rootComponent, rootProps); // 虚拟dom
        console.log(vnode)
        // 渲染 render （vnode,container）
        render(vnode, container);
        // 容器
        app._container = container;
      },
    };
    return app;
  };
}
