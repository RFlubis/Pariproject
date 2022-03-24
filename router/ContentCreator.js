const express = require('express')
const router = express.Router()
const Controller = require('../controller/controller')
const multer = require('multer')
const path = require("path")
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage })



router.get('/', Controller.Home)

router.get('/signup', Controller.SignUp)
router.post('/signup', Controller.SignUpPost)

router.get('/login', Controller.login)
router.post('/login', Controller.loginpost)

router.use((req, res, next) => {
  if(!req.session.member){
    const error = 'plese login first'
    res.redirect(`/login?error=${error}`)
  }else{
    next()
  }
})

router.get('/:userid/profile', Controller.profile)
router.post('/:userid/profile', Controller.profilepost)
router.get('/:userid/mainhome', Controller.mainhome)
router.get('/:userid/creator', Controller.addGifGet)
router.get('/:userid/creator/like', Controller.like)
router.get('/:userid/creator/dislike', Controller.dilike)
router.post('/:userid/creator', upload.single('avatar'), Controller.addGifPost)

module.exports = router