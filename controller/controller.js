'use strict'

const { Profile, Member, Post } = require('../models/index')
const member = require('../models/member')
const bcrypt = require('bcryptjs')

class Controller {
    static Home(req, res) {
        res.render('home')
    }

    static SignUp(req, res) {
        const { error } = req.query
        res.render('signup', { error })
    }

    static SignUpPost(req, res) {
        const { email, password, role } = req.body
        const option = {
            email,
            password,
            role
        }

        Member.create(option)
            .then(() => {
                res.redirect('/login')
            }).catch(err => {
                if (err.name === "SequelizeValidationError") {
                    err = err.errors
                    err = err.map(e => { return e.message })
                }
                res.redirect(`/signup?error=${err}`)
            })
    }

    static login(req, res) {
        const { error } = req.query
        res.render('login', { error })
    }

    static loginpost(req, res) {
        const { email, password } = req.body


        Member.findOne({
            where: { email },
            include: [Profile]
        })
            .then(result => {

                if (result) {
                    const valid = bcrypt.compareSync(password, result.password)

                    if (valid) {
                        req.session.member = result.id
                        if (!result.Profile) {
                            return res.redirect(`/${result.id}/profile`)
                        }
                        return res.redirect(`/${result.id}/mainhome`)
                    } else {
                        const error = 'invalid username/password'
                        return res.redirect(`./login?error=${error}`)
                    }
                } else {
                    const error = 'invalid username/password'
                    return res.redirect(`./login?error=${error}`)
                }
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    }

    static mainhome(req, res) {
        const { userid } = req.params
        let data = {}
        Member.findByPk(userid, {
            include: [Profile]
        })
            .then(member => {
                data.member = member
                return Post.findAll()
            })
            .then(Post => {
                data.Post = Post
                res.render('mainhome', { data })
            })
            .catch(err => {
                console.log(err);
                res.send(err)
            })
    }

    static profile(req, res) {
        const { error } = req.query
        const { userid } = req.params
        res.render('profile', { userid, error })
    }

    static profilepost(req, res) {
        const { userid } = req.params
        const { name, gender, selfDescription } = req.body
        const option = {
            name,
            gender,
            selfDescription,
            MemberId: userid
        }
        Member.findByPk(userid)
            .then(result => {
                option.registeredEmail = result.email
                return Profile.create(option)
            })
            .then(() => {
                res.redirect(`/${userid}/mainhome`)
            }).catch(err => {
                if (err.name === "SequelizeValidationError") {
                    err = err.errors
                    err = err.map(e => { return e.message })
                }
                res.redirect(`/${userid}/profile?error=${err}`)
            })
    }

    static addGifGet(req, res) {
        const { userid } = req.params
        res.render("addContent", { userid })
    }

    static addGifPost(req, res) {
        // res.send(req.file.path)
        const { userid } = req.params
        const { filename } = req.file
        const { title, description } = req.body
        let newPost = {
            title, fileUpload: filename, description, MemberId: userid
        }

        Post.create(newPost)
            .then(() => {
                res.redirect('./mainhome')
            }).catch(err => {
                if (err.name === "SequelizeValidationError") {
                    err = err.errors
                    err = err.map(e => { return e.message })
                }
                res.redirect(`/signup?error=${err}`)
            })
    }
}

module.exports = Controller