#!/usr/bin/env node
const program = require('commander');
const child_process = require('child_process');
const fs = require('fs');
const readline = require('readline');
let readInfoArr = []
let readAuthor = ''

program
  .version('1.0.0')

program
  .command('codeLineNum')
  .description('统计git提交代码量')
  .option("--author [author]", "统计指定作者git提交代码量")
  .action(function (options) {
    if (options.author && options.author === true) {
      console.log('请输入作者的名字')
      process.exit(1)
    }
    getAllAuthor(options.author)
  }).on('--help', function () {
    console.log('');
    console.log('Examples:');
    console.log('  git-tool codeLineNum', '统计所有人的代码量');
    console.log('  git-tool codeLineNum --author=adai', '统计所有人的代码量');
  });

program.parse(process.argv);


// 获取所有作者
function getAllAuthor(author) {
  const cmd = `git log --format='%aN'`
  let subprocess = child_process.exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      process.exit(1)
    }
    readAuthor = ''
    const randomFile = randomFileName()
    fs.writeFileSync(randomFile, stdout)
    const rl = readline.createInterface({
      input: fs.createReadStream(randomFile)
    });
    rl.on('line', (input) => {
      readAuthor = readAuthor + input + '\t'
    });

    rl.on('close', () => {
      fs.unlink(randomFile, (err) => {
        if (err) {
          console.error(err)
          process.exit(1)
        }
        let arr = readAuthor.split('\t')
        let uniqueArr = [...new Set(arr)]
        if (author && uniqueArr.indexOf(author) != -1) {
          getCodeLineNumByAuthor(author)
        }
        if (author && uniqueArr.indexOf(author) == -1) {
          console.error('输入作者无效')
          process.exit(1)
        }
        if (!author) {
          uniqueArr.forEach((ele) => {
            if (ele) {
              getCodeLineNumByAuthor(ele)
            }
          })
        }
      })
    });
  })
}

// 获取指定作者的git代码量
function getCodeLineNumByAuthor(author) {
  const cmd = `git log --author=${author} --pretty=tformat: --numstat`
  let subprocess = child_process.exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      process.exit(1)
    }
    let readInfoArr = []
    let randomFile = randomFileName()
    fs.writeFileSync(randomFile, stdout)
    const rl = readline.createInterface({
      input: fs.createReadStream(randomFile)
    });
    rl.on('line', (input) => {
      let arr = input.split('\t')
      let obj = { add: arr[0], del: arr[1], file: arr[2] }
      if (obj.file !== 'package-lock.json') {
        readInfoArr.push(obj)
      }
    });
    rl.on('close', () => {
      fs.unlinkSync(randomFile)
      let result = handleLine(readInfoArr)
      result.author = author
      console.log(result)
    });
  })
}

// 逐行读取文件并计算提交数据
function handleLine(readInfoArr) {
  let total = 0, add = 0, del = 0;
  readInfoArr.forEach((ele) => {
    add += ele.add - 0 === Number(ele.add) ? Number(ele.add) : 0;
    del += ele.del - 0 === Number(ele.del) ? Number(ele.del) : 0;
  })
  total = add - del;
  return { total, add, del }
}

// 生成随即文件名称
function randomFileName() {
  return 'git-tool' + Date.now() + Math.random() * 1000 + '.text'
}