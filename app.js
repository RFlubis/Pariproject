const express = require('express')
const app = express()
const port = process.env.port || 3000
const router = require('./router/ContentCreator')
const session = require('express-session')
const path = require("path")

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})