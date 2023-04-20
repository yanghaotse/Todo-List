const express = require('express')
const Todo = require('../../models/todo')
const router = express.Router()

// 前往新增頁面route
router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增一筆資料route
router.post('/', (req, res) => {
  const name = req.body.name //這邊的name為<input>的name
  // console.log(name) //檢查取出的資料
  return Todo.create({ name }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// detail route
// 1.先在index.hbs將detail導向的目標網址參數設為MongoDb中的_id 2.用params抓出點選目標的id 3.運用此id帶回資料庫搜尋 4.最後將畫面選染出來
router.get('/:id', (req, res) => {
  const id = req.params.id
  // console.log(id)//檢查
  return Todo.findById(id)  //從資料庫裡找出"特定一筆"資料
    .lean() //將資料整理乾淨
    .then((todo) => res.render('detail',{ todo })) //todo為選取完存放的變數
    .catch(error => console.log(error))
})

// edit route
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  // console.log(id)//檢查
  return Todo.findById(id)  //從資料庫裡找出"特定一筆"資料
    .lean() //將資料整理乾淨
    .then((todo) => res.render('edit',{ todo })) //todo為選取完存放的變數
    .catch(error => console.log(error))
})

// edit post route
router.put("/:id", (req,res) => {
  const id = req.params.id
  // console.log(req.body) //檢查req.body
  // const name = req.body.name
  // const isDone = req.body.isDone //可減寫為下方:結構賦值
  const {name, isDone} = req.body
  return Todo.findById(id)
    .then((todo) => {
      todo.name = name 
      // if(todo.isDone === 'on'){
      //   todo.isDone = true
      // }else{
      //   todo.isDone = false
      // }
      // 上部分可減寫成下方
      todo.isDone = isDone === 'on' //checkbox回傳值為'on'，否則不會代值
      return todo.save() //如果查詢成功，修改後重新儲存資料(先將修改後的資料儲存，防止非同步狀況)
    })
    .then(() => res.redirect(`/todos/${id}`)) //如果儲存成功，導向首頁
    .catch(error => console.log(error))
})


// delete route
router.delete('/:id',(req, res) => {
  const id = req.params.id
  return Todo.findById(id)
    .then((todo) => todo.remove())
    .then(() => res.redirect('/'))// 用res.render('index')後面要加{ todos }變數
    .catch(error => console.log(error))
})



module.exports = router