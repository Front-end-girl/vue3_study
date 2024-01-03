// 进行打包 monerepo
// (1) 获取打包文件- 通过目录

import { statSync, readdirSync } from "node:fs";
import { execa } from "execa";

// （2）并行打包，对应的分包执行命令行
async function build(target) {
  console.log(target);
  // 注意execs -c 执行rollup配置，环境变量 -env -cw 热启动 
  await execa("rollup", ["-cw", "--environment", `TARGET:${target}`], {
    stdio: "inherit", // 子进程的执行可以再父包中输出 否则在rollup.config.js console.log 不显示
    // 'inherit': 将子进程的标准输入、输出或错误流直接连接到父进程的对应流。
    // 这样可以使子进程的输出和错误信息直接显示在父进程的控制台上。
  }); // rollup 打包 执行里面配置
}
build('runtime-dom')