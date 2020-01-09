#!/usr/bin/env node
const program = require('commander');

program
  .version(`${require('../../package').version}`)
  .usage('<command> [options]')

program
  .command('codeLineNum')
  .description('统计git提交代码量')
  .option("-a, --author [author]", "统计指定贡献者在项目中的git提交代码量")
  .action(function (options) {    
    if (options.author && options.author === true) {
      console.log('请输入贡献者的名字')
      process.exit(1)
    }
    require('../lib/codeLineNum')(options.author)
  }).on('--help', function () {
    console.log('');
    console.log('Examples:');
    console.log(' git-tool codeLineNum', '统计所有贡献者的代码量');
    console.log(' git-tool codeLineNum -a adai', '统计指定贡献者的代码量');
    console.log(' git-tool codeLineNum --author adai', '统计指定贡献者的代码量');
  });

program.parse(process.argv);
