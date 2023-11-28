// 柯里化：根据不同的参数做不同的处理

import {
  isObject,
  extend,
  isArray,
  isIntegerKey,
  hasOwn,
  hasChanged,
  isSymbol,
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
    // 现在，
    // 整个条件判断的含义可以解释为：
    // 如果key是Symbol类型且是内置Symbol之一，
    // 或者key是不可追踪的键，那么直接返回res，不再进行后续的响应式处理。
    // 这是因为这些特殊情况可能会引发一些问题，需要特殊处理或者避免。
    if (isSymbol(key)) {
      return res;
    }
    if (!isReadonly) {
      // 不是只读
      //收集依赖 effect
      // console.log("get", arguments); // 数组默认的
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
    // console.log("createSetter", JSON.parse(JSON.stringify(arguments)));
    // 触发更新
    // (1) 数组还是对象 （2） 添加值 还是修改
    // (1) 获取老值
    const oldValue = target[key];
    // 判断是修改还是新增
    const hadkey =
      isArray(target) && isIntegerKey(key)
        ? Number(key) < target.length
        : hasOwn(target, key);
    // debugger;
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
