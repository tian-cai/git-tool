#!/usr/bin/env node
const program = require('commander')
const didYouMean = require('didyoumean')
const chalk = require('chalk')
const util = require('../lib/util')
const requiredVersion = require('../../package.json').engines.node

didYouMean.threshold = 0.5

util.checkNodeVersion(requiredVersion, `${require('../../package').name}`)

program
  .version(`${require('../../package').version}`)
  .usage('<command> [options]')

program
  .command('codeLineNum')
  .description('统计git提交代码量')
  .option("-a, --author [author]", "统计指定贡献者在项目中的git提交代码量")
  .action(function (options) {
    if (options.author && options.author === true) {
      console.log(chalk.yellow('请输入贡献者的名字'))
      process.exit(1)
    }
    require('../lib/codeLineNum')(options.author)
  }).on('--help', function () {
    console.log('');
    console.log('Examples:');
    console.log(' git-tool codeLineNum', '统计所有贡献者的代码量');
    console.log(' git-tool codeLineNum -a adai', '统计指定贡献者的代码量');
    console.log(' git-tool codeLineNum --author adai', '统计指定贡献者的代码量');
    console.log('');
  });

program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log()
    console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}`))
    console.log()
    suggestCommands(cmd)
  })

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name)

  const suggestion = didYouMean(unknownCommand, availableCommands)
  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)} ?`))
  }
}
