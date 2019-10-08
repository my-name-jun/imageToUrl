var express = require('express')
var router = express.Router()
var path = require('path')
var fs = require('fs')

function readFile(path, filename, func) {
  fs.readFile(path + '/' + 'test.html', 'utf-8', function(err, data) {
    if (err) {
      console.log('读取失败')
    } else {
      func(data)
    }
  })
}
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
function copyFile(resPath, desPath, filename) {
  return new Promise((resolve, reject) => {
    readFile(resPath, filename, function(data) {
      writeFile(desPath, data, filename)
      resolve()
    })
  })
}
function replaceFile(someFile, title, url) {
  fs.readFile(someFile, 'utf8', function(err, data) {
    if (err) {
      console.log(err)
    } else {
      var resultTitle = data.replace(/resultTitle/g, title)
      var result = resultTitle.replace(/resultImg/g, url)
      fs.writeFile(someFile, result, err => {
        if (err) {
          return console.log(err)
        } else {
          // console.log("chulai")
        }
      })
    }
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
  const sourcePath1 = path.resolve(__dirname)
  const sourcePath2 = path.resolve(__dirname, '../public/test')
  copyFile(sourcePath1, sourcePath2, src + '.html').then(() => {
    replaceFile(sourcePath2 + '/' + src + '.html', title, url)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    var aa = {
      result: 'http://106.54.244.36:3000/test/' + src + '.html'
    }
    res.end(JSON.stringify(aa))
  })
})

module.exports = router
