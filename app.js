const express = require('express')
const app = express()
const ejs = require('ejs')
const bodyParser = require('body-parser')  // 处理post请求
const path = require('path')





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const daily = require('./routes/daily')
const convert = require('./routes/convert')
const related = require('./routes/related')
const related2 = require('./routes/related2')
const single = require('./routes/single')
const csv = require('./routes/csv')
const static = require('./routes/static')

app.use('/daily',daily.router)  // 爬取一段日期内数据
app.use('/convert',convert.router)  // csv格式转换为js文件
app.use('/related',related) // 获取相关词
app.use('/related2',related2.router)  // 多选文件 获取 related
app.use('/single',single)           //   上传jskeys 来获取对应的related
app.use('/csv',csv)               //  js 转csv
app.use('/static',static)       // 通过jskeys文件 来获取 related （必须手动修改文件路径） 非上传形式


app.get('/',(req,res,next) => {
  res.redirect('/daily')
})


app.set('views',path.join(__dirname,'views'))
app.engine('.html',ejs.__express)
app.set('view engine','html')





app.listen(3000,() => {
  console.log('port 3000')
})