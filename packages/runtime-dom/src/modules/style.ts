// style:{color:'red'} =>style:{background:'red'}
export const patchStyle = (el, prev, next) => {
  const style = el.style;
  if (next == null) {
    el.removeAttribute("style");
  } else {
    if (prev) {
      for (let key in prev) {
        // 老的有 新的没有
        if (next[key] == null) {
          style[key] = "";
        }
      }
    }
    // 新的有
    for (const key in next) {
      style[key] = next[key];
    }
  }
};
