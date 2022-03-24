const express = require('express')
const router = express.Router()
const Controller = require('../controller/controller')



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

router.get('/:userid/mainhome', Controller.mainhome)

module.exports = router