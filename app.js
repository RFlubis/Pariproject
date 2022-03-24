const express = require('express')
const app = express()
const port = 3000
const router = require('./router/ContentCreator')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.use('/', router)
//test

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})