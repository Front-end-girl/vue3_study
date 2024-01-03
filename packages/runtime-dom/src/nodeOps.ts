// 节点操作方法

export const nodeOps = {
  // 元素的操作
  // 创建元素
  createElement: (tagName) => document.createElement(tagName),
  // 删除元素
  remove: (child) => {
    const parent = child.parent;
    if (parent) {
      parent.removeChild(child);
    }
  },
  // 插入
  insert: (child, parent, ancher = null) => {
    parent.insertBefore(child, ancher); //ancher=null appendchild
  },
  querySelecter: (select) => document.querySelector(select),
  setElementText: (el, text) => {
    el.textContent = text;
  },
  // 节点 、文本操作
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
};
