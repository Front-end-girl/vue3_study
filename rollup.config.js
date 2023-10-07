// 通过rollup打包
// (1) 引入相关依赖
import ts from "rollup-plugin-typescript2"; // 解析ts
import json from "@rollup/plugin-json"; // 解析json
import resolvePlugin from "@rollup/plugin-node-resolve"; // 解析第三方插件
import path from "node:path";

import { fileURLToPath } from "node:url";

// (2) 获取文件路径
const __dirname = fileURLToPath(new URL(".", import.meta.url)); //现在是 ESM 规范，没有全局变量 __dirname ，在 ESM 规范中需要自己定义变量才能使用。 获取当前文件目录
let packagesDir = path.resolve(__dirname, "packages");

// 2.1 获取需要打包的包路径
let packageDir = path.resolve(packagesDir, process.env.TARGET);

// 2.2 打包路径获取之后 获取每个包的项目配置

const resolve = (p) => path.resolve(packageDir, p); // 获取针对路径下的某个文件

// require 获取某个路径下的内容
const pkg = require(resolve("package.json"));
console.log(packageDir, packagesDir);
