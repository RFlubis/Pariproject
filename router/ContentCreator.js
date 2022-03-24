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
  console.log(req.session);
  console.log('Time:', Date.now())
  next()
})

router.get('/:userid/profile', Controller.profile)
router.post('/:userid/profile', Controller.profilepost)
router.get('/:userid/mainhome', Controller.mainhome)
router.get('/:userid/creator', Controller.creatorContentList)
router.get('/:userid/creator/add', Controller.creatorAddGifGet)

router.post('/:userid/creator/add', upload.single('avatar'), Controller.creatorAddGifPost)
router.get('/:userid/:postid/edit', Controller.editPostGet)
router.post('/:userid/:postid/edit', Controller.editPostPost)
router.get('/:userid/:postid/delete', Controller.deletePost)

module.exports = router