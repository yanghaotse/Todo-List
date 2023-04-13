const express = require('express')
const mongoose = require('mongoose')


// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const app = express()
const port = 3000

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log("mongodb error!")
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


app.get('/', (req,res) =>{
  res.send("hello")
})

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}` )
})