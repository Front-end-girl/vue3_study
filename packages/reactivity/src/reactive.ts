let reactiveHandlers = {};
let shallowReactiveHandlers = {};
let readonlyHandlers = {};
let shallowReadonlyHandlers = {};

export function reactive(target: object) {
  return createReactive(target, false, reactiveHandlers);
}
export function shallowReactive(target: object) {
  return createReactive(target, false, shallowReactiveHandlers);
}
export function readonly(target: object) {
  return createReactive(target, false, readonlyHandlers);
}
export function shallowReadonly(target: object) {
  return createReactive(target, false, shallowReadonlyHandlers);
}
function createReactive(target, isReadonly, baseHandlers) {}
