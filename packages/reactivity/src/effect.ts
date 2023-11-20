// 定义effect 定义相关属性

import { isArray, isIntegerKey } from "@vue/shared";
import { TriggerOpTypes } from "./operations";

// 收集依赖
export function effect(fn, options: any = {}) {
  // console.log("执行几次");
  const effect = createReactEffect(fn, options);
  if (!options.lazy) {
    effect();
  }
  return effect;
}
let uid = 0;
let activeEffect; // 保存当前动态的effect
const effectStack = [];

function createReactEffect(fn, options) {
  const effect = function reactiveEffect() {
    if (!effectStack.includes(effect)) {
      // 保证effect没有加入到栈中
      try {
        activeEffect = effect;
        effectStack.push(effect);
        fn(); //执行用户的方法 // set 修改执行回调方法
      } finally {
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
        //用于处理
        //   effect(() => { // effect1
        //     // 默认执行 获取代理的数据 ref proxy 执行get方法 收集effect
        //     app.innerHTML = state.a + state.a;
        //     effect(()=>{ // effect2
        //         state.a
        //     })
        //     state.a // effect1
        //   });
      }
    }
  };

  effect.id = uid++; // 区别effect
  effect._isEffect = true; // 区别effect 是不是响应式的effect
  effect.raw = fn; // 保存用户的方法
  effect.options = options; // 保存用户的属性
  return effect;
}

// 收集effect 在获取数据的时候 触发get 收集effect
let targetMap = new WeakMap();
export function Track(target, type, key) {
  //   key 和我们的effect一一对应 weakmap -target-map-key-[effect]-set
  if (activeEffect === undefined) {
    return;
  }
  // 获取effect {target:dep}
  let depMap = targetMap.get(target);
  if (!depMap) {
    targetMap.set(target, (depMap = new Map()));
  }
  let dep = depMap.get(key); // {name:[]}
  if (!dep) {
    depMap.set(key, (dep = new Set()));
  }
  // 有没有effect key
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
  }
}
// 触发更新
export function trigger(target, type, key?, newValue?, oldValue?) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  // 有
  // let effects = depsMap.get(key); // set[]
  let effectSet = new Set(); // 有多个同时修改几个值
  const add = (effectAdd) => {
    if (effectAdd) {
      effectAdd.forEach((effect) => effectSet.add(effect));
    }
  };

  // 处理数组 就是key ===length
  if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    console.log(depsMap)
    depsMap.forEach((dep, key) => {
      // 如果更改的长度小于收集索引 重新执行effect
      if (key === "length" || key >= newLength) {
        add(dep); //获取当前属性effect 触发
      }
    });
  } else {
    // 对象
    if (key != undefined) {
      add(depsMap.get(key)); //获取当前属性effect 触发
    }
    // 数组 修改 索引
    switch (type) {
      case TriggerOpTypes.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          console.log(depsMap)
          add(depsMap.get("length")); //获取当前属性effect 触发
        }
        break;

      default:
        break;
    }
  }
  // 执行
  effectSet.forEach((effect: any) => effect());
}
