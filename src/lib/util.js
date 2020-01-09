const util = {
    randomFileName: randomFileName
}

// 生成随即文件名称
function randomFileName(filename, extension) {
    return `${filename}${Date.now()}${Math.random() * 1000}${extension}`
}

module.exports = util