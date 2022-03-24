const express = require('express')
const app = express()
const port = 3000
const router = require('./router/ContentCreator')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const session = require('express-session')

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(router)


//test

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})