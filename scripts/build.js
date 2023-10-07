// 进行打包 monerepo
// (1) 获取打包文件- 通过目录

import { statSync, readdirSync } from "node:fs";
import { execa } from "execa";
// 文件夹才打包
const dirs = readdirSync("packages").filter((p) => {
  return statSync(`packages/${p}`).isDirectory();
});

console.log(dirs);
// 并行打包
async function build(target) {
  // 注意execs -c 执行rollup配置，环境变量 -env
  await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {
    stdio: "inherit", // 子进程的执行可以再父包中输出
  }); // rollup 打包 执行里面配置
}
async function runParaller(dirs, build) {
  let result = [];
  for (let item of dirs) {
    result.push(build(item));
  }
  return Promise.all(result); // 存放打包
}
runParaller(dirs, build).then(() => {
  //Promise
  console.log("suceess");
});
