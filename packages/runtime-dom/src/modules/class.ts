export const patchClass = (el, value) => {
  //处理
  if (value == null) {
    value = "";
  }
  el.className = value;
};
