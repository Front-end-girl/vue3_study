// 通过rollup打包
// (1) 引入相关依赖
import ts from "rollup-plugin-typescript2"; // 解析ts
import json from "@rollup/plugin-json"; // 解析json
import resolvePlugin from "@rollup/plugin-node-resolve"; // 解析第三方插件
import path from "node:path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

import { fileURLToPath } from "node:url";

// (2) 获取文件路径
const __dirname = fileURLToPath(new URL(".", import.meta.url)); //现在是 ESM 规范，没有全局变量 __dirname ，在 ESM 规范中需要自己定义变量才能使用。 获取当前文件目录
let packagesDir = path.resolve(__dirname, "packages"); // 所有包的路径

// 2.1 获取需要打包的包路径
let packageDir = path.resolve(packagesDir, process.env.TARGET);
console.log("packageDir", packageDir);

// 2.2 打包路径获取之后 获取每个包的项目配置
const resolve = (p) => path.resolve(packageDir, p); // 获取针对路径下的某个文件

// require 获取某个路径下的内容 resolve("package.json") 获取到该路径  因node升级 require不允许直接使用 需要使用createRequire
const pkg = require(resolve("package.json"));

console.log("pkg", pkg);

const packageOptions = pkg.buildOptions || {}; // 获取打包的格式

// 获取包名
const name = packageOptions.filename || path.basename(packageDir);

console.log("name", path.basename(packageDir));

// 3. 创建一个 表
// 映射表
const outputOptions = {
  "esm-bundler": {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`, // 解析js
  },
  "esm-browser": {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`, // 解析node
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`, // 立即执行函数
  },
};

const options = pkg.buildOptions;

function createConfig(format, output) {
  output.name = options.name;
  output.sourcemap = true;

  // 生成rollup配置
  return {
    input: resolve("src/index.ts"), // 导入
    output,
    plugins: [
      json(),
      ts({
        // 解析ts
        tsconfig: path.resolve(__dirname, "tsconfig.json"),
      }),
      resolvePlugin(), // 解析 第三方 插件
    ],
  };
}

// rollup 需要导出一个配置 formats 配置的文件 根据input 和output
export default options.formats.map((format) =>
  createConfig(format, outputOptions[format])
);
