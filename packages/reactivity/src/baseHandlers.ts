// 柯里化：根据不同的参数做不同的处理

import {
  isObject,
  extend,
  isArray,
  isIntegerKey,
  hasOwn,
  hasChanged,
} from "@vue/shared";
import { reactive, readonly } from "./reactive";
import { TrackOpTypes, TriggerOpTypes } from "./operations";
import { Track, trigger } from "./effect";

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
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 不是只读
      //收集依赖 effect
      Track(target, TrackOpTypes.GET, key);
    }
    if (shallow) {
      // 是浅的 只返回第一层代理{name:'';list:{}}
      return res;
    }
    // key 是对象 递归 vue3

    // 面试性能优化：懒代理 嵌套多层 不取下一层，就不会跑这个if代码 使用懒代理，只对第一层代理，然后下面的数据只有取值了，才去代理
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res); // 递归 懒代理
    }

    return res;
  };
}

function createSetter(shallow = false) {
  return function set(target, key, value, receiver) {
    // 触发更新
    // (1) 数组还是对象 （2） 添加值 还是修改
    // (1) 获取老值
    const oldValue = target[key];
    // 判断是修改还是新增
    const hadkey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);
    // 设置值
    const result = Reflect.set(target, key, value, receiver);
    if (!hadkey) {
      // 新增 -- 是否还能代理
      trigger(target, TriggerOpTypes.ADD, key, value);
    } else {
      // 新值和原来值是否一样
      // 修改
      if (hasChanged(value, oldValue)) {
        trigger(target, TriggerOpTypes.SET, key, value); //触发更新
      }
    }

    return result;
  };
}
// 高阶函数（柯里化）-、设计模式、结构化
