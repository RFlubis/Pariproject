'use strict'

const {Profile,Member} = require('../models/index')
const member = require('../models/member')
const bcrypt = require('bcryptjs')

class Controller{
    static Home(req,res){
        res.render('home')
    }

    static SignUp(req,res){
        res.render('signup')
    }

    static SignUpPost(req,res){
        const {email,password,role} = req.body
        const option = {
            email,
            password,
            role
        }

        Member.create(option)
        .then(()=>{
            res.redirect('/login')
        }).catch(err=>{
            if(err.name === "SequelizeValidationError") {
                err = err.errors
                err = err.map(e=>{return e.message})
            }
            res.send(err)
        })
    }

    static login(req,res){
        res.render('login')
    }

    static loginpost(req,res){
        const {email,password} = req.body
   
        console.log( req.body);
        Member.findOne({
            where : {email}
        })
        .then(result=>{
            if(result){
                const valid = bcrypt.compareSync(password, result.password)
                if(valid){
                    res.redirect('/')
                }else{  
                    const error = 'invalid username/password'
                    res.redirect(`./login?error=${error}`)
                }
            }else{
                const error = 'invalid username/password'
                res.redirect(`./login?error=${error}`)
            }
        })
    }
}

module.exports = Controller