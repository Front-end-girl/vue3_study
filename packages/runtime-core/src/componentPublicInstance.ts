import { hasOwn } from "@vue/shared";

export const componentPublicInstance = {
  get({ _: instance }, key) {
    const { props, data, setupState } = instance;
    // 属性是$ 不能获取
    if (key[0]) {
      return;
    }
    if (hasOwn(props, key)) {
      return props[key];
    } else if (hasOwn(setupState, key)) {
      return setupState[key];
    }
  },
  set({ _: instance }, key, value) {
    const { props, data, setupState } = instance;
    if (hasOwn(props, key)) {
      props[key] = value;
    } else if (hasOwn(setupState, key)) {
      setupState[key] = value;
    }
  },
};
