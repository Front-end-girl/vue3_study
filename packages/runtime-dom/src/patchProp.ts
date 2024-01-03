// 节点增删改查
// 策略模式 div class style a=1 onClick=
import { patchClass } from "./modules/class";
import { patchStyle } from "./modules/style";
import { patchAttr } from "./modules/attr";
import { patchEvent } from "./modules/event";
export const patchProps = (el, key, prevValue, nextValue) => {
  if (key === "class") {
    patchClass(el, nextValue); // 把原来的class替换
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else {
    // onClick
    //判断是不是事件
    if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }
};
