# git-tool
统计个人代码提交量的命令行工具

### 全局安装
```
npm install git-tool -g
```
### 使用方法
```
git-tool codeLineNum 统计所有作者的代码量

git-tool codeLineNum --author=xxx  统计xxx的代码量
```

**统计代码数目不包括package-lock.json文件**

> 如有bug，欢迎反馈