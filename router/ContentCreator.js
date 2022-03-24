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

module.exports = router