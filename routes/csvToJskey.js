const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const multer = require('multer')
const upload = multer({dest:'./temp/'})


function pathResolve(dir) {
  return path.join(__dirname,dir)
}

// 渲染页面
router.get('/',(req,res,next) => {
  res.render('csvToJskey/csvToJskey')
})


/**
 * @description array('uploadFile) 属性代表上传多个文件 uploadFile 代表input的name属性
 * @description 多个文件用 req.files访问
 * @description 单个文件用 upload.single() 方法 用req.file来访问
 */
router.post('/',upload.array('uploadFile'),(req,res,next) => {
  req.files.forEach((file,index,self) => {

    let list = []
    const fileLength = self.length
    const readPath = file.path
    const readStream = fs.createReadStream(readPath)
    const fileName = file.originalname.slice(0,1) // 取原文件的第一位文字当名字
    const writePath = pathResolve(`../outputFiles/jskeys/${fileName}.js`)  // 转出为js文件
    const writeStream = fs.createWriteStream(writePath)
    const rl = readline.createInterface({
      input:readStream
    })
    rl.on('line',line => {
      list.push(line)
    })
    rl.on('close',line => {
      writeStream.write('exports.keys = '+JSON.stringify(list,'','\t'),err => {
        if(!err) {
          console.log(`${file.originalname}转换成功`)
        }
        if(index === fileLength -1) {
          res.send('文件全部转换完')
        }
      })
    })
  })
})




module.exports = {
  router:router
}