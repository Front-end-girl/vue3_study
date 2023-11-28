import { isFunction } from "@vue/shared";
import { effect } from "./effect";

export function computed(getterOrOptions) {
  // 注意 1、函数 2. 对象

  // 1. 处理数据
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    // 函数
    getter = getterOrOptions;
    setter = () => {
      console.warn("computed value must be readonly");
    };
  } else {
    // 对象
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
}

class ComputedRefImpl {
  // 定义属性
  public _dirty = true; // 默认获取执行
  public _value;
  public effect;

  constructor(public getter, public setter) {
    this.effect = effect(getter, {
      lazy: true,
      sch: () => {
        if (!this._dirty) {
          this._dirty = true;
        }
      },
    }); // 收集依赖,不执行
  }
  //   this._dirty  什么时候设置成true 怎么实现 获取.value 才执行
  get value() {
    if (this._dirty) {
      this._value = this.effect(); // 默认返回computed实例,在获取的时候才执行effect
      this._dirty = false;
    }
    return this._value;
  }
  set value(newValue) {
    console.log("jjjjjj");
    this.setter(newValue);
  }
}
