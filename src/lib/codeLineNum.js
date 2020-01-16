const childProcess = require('child_process')
const fs = require('fs')
const readline = require('readline')
const chalk = require('chalk')
const util = require('./util')

function getAllAuthor (author) {
    const cmd = 'git log --format=\'%aN\''
    childProcess.exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(chalk.red(error))
            process.exit(1)
        }
        let readAuthor = ''
        const randomFile = util.randomFileName('git-tool', '.text')
        fs.writeFileSync(randomFile, stdout)
        const rl = readline.createInterface({
            input: fs.createReadStream(randomFile)
        })
        rl.on('line', (input) => {
            readAuthor = readAuthor + input + '\t'
        })

        rl.on('close', () => {
            fs.unlink(randomFile, (err) => {
                if (err) {
                    console.error(chalk.red(err))
                    process.exit(1)
                }
                const arr = readAuthor.split('\t')
                const uniqueArr = [...new Set(arr)]
                if (author && uniqueArr.indexOf(author) !== -1) {
                    getCodeLineNumByAuthor(author)
                }
                if (author && uniqueArr.indexOf(author) === -1) {
                    console.log(chalk.yellow('该贡献者对该项目没有贡献代码'))
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
        })
    })
}

// 获取指定作者的git代码量
function getCodeLineNumByAuthor (author) {
    const cmd = `git log --author='${author}' --pretty=tformat: --numstat`
    childProcess.exec(cmd, { maxBuffer: 2000 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.log(chalk.red(error))
            process.exit(1)
        }
        const readInfoArr = []
        const randomFile = util.randomFileName('git-tool', '.text')
        fs.writeFileSync(randomFile, stdout)
        const rl = readline.createInterface({
            input: fs.createReadStream(randomFile)
        })
        rl.on('line', (input) => {
            const arr = input.split('\t')
            const obj = { add: arr[0], del: arr[1], file: arr[2] }
            if (obj.file !== 'package-lock.json') {
                readInfoArr.push(obj)
            }
        })
        rl.on('close', () => {
            fs.unlinkSync(randomFile)
            const result = handleLine(readInfoArr)
            result.author = author
            console.log(`{ total: ${chalk.yellowBright(result.total)}, add: ${chalk.greenBright(result.add)}, del: ${chalk.redBright(result.del)}, author: ${result.author} }`)
        })
    })
}

// 逐行读取文件并计算提交数据
function handleLine (readInfoArr) {
    let total = 0; let add = 0; let del = 0
    readInfoArr.forEach((ele) => {
        add += ele.add - 0 === Number(ele.add) ? Number(ele.add) : 0
        del += ele.del - 0 === Number(ele.del) ? Number(ele.del) : 0
    })
    total = add + del
    return { total, add, del }
}

module.exports = getAllAuthor
