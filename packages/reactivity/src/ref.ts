import { trigger, Track } from "./effect";
import { TrackOpTypes, TriggerOpTypes } from "./operations";
import { hasChanged, isArray } from "@vue/shared";

export function ref(target) {
  return createRef(target);
}

export function shallowRef(target) {
  return createRef(target, true);
}

// 创建类
class RefImpl {
  public __v_isRef = true; // 标识他是ref
  public _value;
  constructor(public rawValue, public shallow) {
    // this.rawValue
    this._value = rawValue; // 用户传入的值
  }

  // 类的属性访问器 --实现响应式 收集依赖 Track 触发更新 trigger

  get value() {
    Track(this, TrackOpTypes.GET, "value");
    return this._value;
  }

  set value(newValue) {
    if (hasChanged(newValue, this._value)) {
      this._value = newValue;
      this.rawValue = newValue;
      trigger(this, TriggerOpTypes.SET, "value", newValue);
    }
  }
}

function createRef(rawValue, shallow = false) {
  return new RefImpl(rawValue, shallow);
}

export function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}

class ObjectRefImpl {
  public __v_isRef = true;
  constructor(public target, public key) {}
  // .value 触发这个方法
  get value() {
    return this.target[this.key];
  }

  set value(newValue) {
    this.target[this.key] = newValue;
  }
}
// 未处理异常
export function toRefs(target) {
  let ret = isArray(target) ? new Array(target.length) : {};
  for (let key in target) {
    ret[key] = toRef(target, key);
  }
  return ret;
}
