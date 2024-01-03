// 事件
// div @click='fn1' div @click='fn2'
// 覆盖不行 一个元素的绑定  addEventListener 会有多个
// 采用缓存 {click:fn} 方法替换 而不是重新 addEventListener

export const patchEvent = (el, key, value) => {
  // 1、对函数缓存
  const invokers = el._vei || (el._vei = {});
  const exist = invokers[key];
  // 旧的有 新的也有
  if (exist && value) {
    exist.value = value; //??????????????????????????
  } else {
    // 获取事件名称
    const eventName = key.slice(2).toLowerCase();
    if (value) {
      //1. 新的有 就的没有
      let invoker = (invokers[eventName] = createInvoker(value));
      el.addEventListener(eventName, invoker);
    } else {
      //2. 新的没有 删除以前
      el.removeEventListener(eventName);
      invokers[eventName] = undefined; // 清除缓存
    }
  }
};
function createInvoker(value) {
  // 事件中心
  const invoker = (e) => {
    invoker.value(e);
  };
  invoker.value = value;
  return invoker;
}
// 1. 给元素缓存一个绑定一个元素事件列表
// 2. 如果缓存没有值 则添加事件并缓存
// 3. 以前绑定过 现在没有 删除
// 4. 都有 则改变 方法名
