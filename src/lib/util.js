const semver = require('semver')
const chalk = require('chalk')

const util = {
    randomFileName: randomFileName,
    checkNodeVersion: checkNodeVersion
}

// 生成随即文件名称
function randomFileName(filename, extension) {
    return `${filename}${Date.now()}${Math.random() * 1000}${extension}`
}

function checkNodeVersion(wanted, id) {
    const isSatisfied = semver.satisfies(process.version, wanted)
    if (!isSatisfied) {
        console.log(chalk.red(
            'You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
          ))
        process.exit(1)
    }
}

module.exports = util