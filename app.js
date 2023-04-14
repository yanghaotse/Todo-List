const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Todo = require('./models/todo') //載入Todo model
const bodyParser = require('body-parser')
const port = 3000
const app = express()


// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })


app.engine('hbs', exphbs({defaultLayout : 'main', extname : '.hbs'}))//在應用程式裡新增了一個叫 hbs 的樣板引擎
// {extname: '.hbs'}，是指定副檔名為 .hbs
app.set('view engine', 'hbs')//hbs元件 正式掛載
app.use(express.urlencoded({ extended: true}))//body-parser


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
  Todo.find() // 取出 Todo model 裡的所有資料，這邊的find()是mongoose提供的語法
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(todos => res.render("index", { todos } )) //todos為取完的資料陣列，再將資料傳給index樣板
    .catch(error => console.error(error))
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})
app.post('/todos', (req, res) => {
  const name = req.body.name //這邊的name為<input>的name
  // console.log(name) //檢查取出的資料
  return Todo.create({ name }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})


// 1.先在index.hbs將detail導向的目標網址參數設為MongoDb中的_id 2.用params抓出點選目標的id 3.運用此id帶回資料庫搜尋 4.最後將畫面選染出來
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  // console.log(id)//檢查
  return Todo.findById(id)  //從資料庫裡找出"特定一筆"資料
    .lean() //將資料整理乾淨
    .then((todo) => res.render('detail',{ todo })) //todo為選取完存放的變數
    .catch(error => console.log(error))
})

app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}` )
})