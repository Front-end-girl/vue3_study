// 公共的方法
export * from "./shapeFlags"; // 判断是元素还是组件得 二进制方法 用位运算
export function isObject(target) {
  return typeof target === "object" && target !== null;
}
export const extend = Object.assign;
export const isArray = Array.isArray;
export const isFunction = (val) => typeof val === "function";
export const isNumber = (val) => typeof val === "number";
export const isString = (val) => typeof val === "string";
// 数组的key是不是整数值
export const isIntegerKey = (key) =>
  isString(key) &&
  key !== "NaN" &&
  key[0] !== "-" &&
  "" + parseInt(key, 10) === key;

export const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key);

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue);
//测试删除二次测试
export const isSymbol = (val: unknown): val is symbol =>
  typeof val === "symbol";
