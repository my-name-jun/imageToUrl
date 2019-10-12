var express = require('express')
var router = express.Router()
var path = require('path')
var fs = require('fs')

// 读取文件
function rFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path + '/' + 'test.html', 'utf-8', function(err, data) {
      if (err) {
        console.log('读取失败')
      } else {
        resolve(data)
      }
    })
  })
}
// 写入文件
function writeFile(path, data, filename) {
  fs.writeFile(
    path + '/' + filename.split('.')[0] + '.' + filename.split('.')[1],
    data,
    function(error) {
      if (error) {
        throw error
      } else {
        console.log('文件已保存')
      }
    }
  )
}
// 替换内容
function replaceText(data, title, url) {
  return new Promise((resolve, reject) => {
    var result = data.replace(/resultTitle/g, title).replace(/resultImg/g, url)
    resolve(result)
  })
}
function generateFile(resPath, desPath, filename, title, url) {
  return new Promise((resolve, reject) => {
    // 读取文件
    rFile(resPath).then(function(data) {
      replaceText(data, title, url).then(function(result) {
        writeFile(desPath, result, filename)
        resolve()
      })
    })
  })
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' })
})
router.post('/test', function(req, res, next) {
  let data = req.body
  let title = data.titleValue
  let url = data.urlValue
  let src = data.srcValue
  let domain = data.domain
  const sourcePath1 = path.resolve(__dirname)
  const sourcePath2 = path.resolve(__dirname, '../public/activity')
  generateFile(sourcePath1, sourcePath2, src + '.html', title, url).then(() => {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    var aa = {
      result: 'http://' + domain + '/activity/' + src + '.html'
    }
    res.end(JSON.stringify(aa))
  })
})

module.exports = router
