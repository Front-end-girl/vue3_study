// 柯里化：根据不同的参数做不同的处理

import { isObject, extend } from "@vue/shared";
import { reactive, readonly } from "./reactive";

const get = createGetter(); // 不是只读，不是浅的
const shallowGet = createGetter(false, true); // 不是只读，不是浅的
const readonlyGet = createGetter(true, false); // 不是只读，不是浅的
const shallowReadonlyGet = createGetter(true, true); // 不是只读，不是浅的

// 是不是深的
const set = createSetter();
const shallowSet = createSetter(true);

export const reactiveHandlers = {
  get,
  set,
};
export const shallowReactiveHandlers = { get: shallowGet, set: shallowSet };

// 进行合并
let readonlyObj = {
  set: (target, key) => {
    console.warn(`set ${target} on key ${key} is faild`);
  },
};

export const readonlyHandlers = extend({ get: readonlyGet }, readonlyObj);
export const shallowReadonlyHandlers = extend(
  {
    get: shallowReadonlyGet,
  },
  readonlyObj
);

// 方法: 只读、深的
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    console.log(target);
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 不是只读
      //收集依赖 effect
    }
    if (shallow) {
      // 是浅的 只返回第一层代理{name:'';list:{}}
      return res;
    }
    // key 是对象 递归 vue3

    // 面试性能优化：懒代理 嵌套多层 不取下一层，就不会跑这个if代码
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res); // 递归 懒代理
    }

    return res;
  };
}

function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    // 触发更新
    return result;
  };
}
