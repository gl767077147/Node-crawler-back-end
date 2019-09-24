const express = require('express')
const router = express.Router()
const readline = require('readline')
const fs = require('fs')
const os = require('os')
const multer = require('multer')
const upload = multer({dest:'./temp/'})
const path = require('path')

function resolve(dir) {
  return path.join(__dirname,dir)
}

router.get('/',(req,res,next) => {
  res.render('csv/csv')
})

router.post('/',upload.array('file'),(req,res,next) => {

  const totalFiles = req.files.length
  let fileFlag = 0

  req.files.forEach(file => {
    let list = []
    let newList = undefined
    const readPath = file.path
    const fileName = file.originalname.slice(0,file.originalname.indexOf('.'))  // 文件名设置为 .js/.csv之前的名
    const readStream = fs.createReadStream(readPath)
    const writePath = resolve(`../files/csvs/${fileName}.csv`)
    const writeStream = fs.createWriteStream(writePath)

    const ready = resolve(`../files/ready/${fileName}.csv`)
    const readyWriteStream = fs.createWriteStream(ready)
  
    const rl = readline.createInterface({
      input:readStream
    })
    rl.on('line',line => {
      list.push(line)
    })
    rl.on('close',line => {
      newList = list.slice(1,list.length-1)
      newList = newList.map(item => {
        return item.replace(/\"/g,'')
      })
      newList = newList.map(item => {
        return item.replace(/,/g,'')
      })
      newList.forEach(item => {
        writeStream.write(item + os.EOL)
        readyWriteStream.write(item + os.EOL)
      })

      fileFlag++
      if(fileFlag === totalFiles) {
        res.send('ok')
      }
    })
  })

})


module.exports = router


