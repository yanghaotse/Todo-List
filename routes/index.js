const express = require('express')
const router = express.Router()
const home = require('./models/home')
const todos = require('./models/todos')


// 將網址結構符合 / 字串的 request 導向 home 模組
router.use('/', home)
// 將網址結構符合 /todos 字串開頭的 request 導向 todos 模組 
router.use('/todos', todos)



module.exports = router