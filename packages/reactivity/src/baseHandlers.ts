// 柯里化：根据不同的参数做不同的处理

import { isObject } from "@vue/shared";
import { reactive, readonly } from "./reactive";

const get = createGetter(); // 不是只读，不是浅的
const shallowGet = createGetter(false, true); // 不是只读，不是浅的
const readonlyGet = createGetter(true, false); // 不是只读，不是浅的
const shallowReadonlyGet = createGetter(true, true); // 不是只读，不是浅的

let reactiveHandlers = { get };
let shallowReactiveHandlers = { get: shallowGet };
let readonlyHandlers = { get: readonlyGet };
let shallowReadonlyHandlers = { get: shallowReadonlyGet };

// 方法: 只读、深的
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      // 不是只读
      //收集依赖
    }
    if (shallow) {
      // 是浅的 只返回第一层代理{name:'';list:{}}
    }
    // key 是对象 递归 vue3
    
    // 面试性能优化：懒代理 嵌套多层 不取下一层，就不会跑这个if代码
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }

    return res;
  };
}
