'use strict'

const { Profile, Member, Post } = require('../models/index')
const member = require('../models/member')
const bcrypt = require('bcryptjs')
const res = require('express/lib/response')

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

    static creatorContentList(req, res) {
        const { userid } = req.params

        Member.findByPk(userid, {
            include: [Post, Profile]
        })
            .then((result) => {
                res.render('contenCreatorList', { result })
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static creatorAddGifGet(req, res) {
        const { userid } = req.params
        res.render("addContent", { userid })
    }

    static creatorAddGifPost(req, res) {
        const { userid } = req.params
        const { filename } = req.file
        const { title, description } = req.body
        let newPost = {
            title, fileUpload: filename, description, MemberId: userid
        }

        Post.create(newPost)
            .then(() => {
                res.redirect('../creator')
            }).catch(err => {
                res.send(err)
            })
    }

    static deletePost(req, res) {
        const { postid } = req.params

        Post.findByPk(postid, {
            include: [Member]
        })
            .then((result) => {
                return Post.destroy({
                    where: {
                        id: result.id
                    }
                })
            })
            .then(() => {
                res.redirect('../creator')
            })
            .catch((err) => {
                res.send(err)
            })

    }

    static editPostGet(req, res) {
        const { postid } = req.params
        Post.findByPk(postid)
            .then((result) => {

                res.render("editContent", { result })
            })
            .catch((err) => {
                res.send(err)
            })

    }
    static editPostPost(req, res) {
        const { postid } = req.params
        const { title, avatar, description } = req.body
        let editPost = {
            title, fileUpload: avatar, description
        }
        Post.findByPk(postid, {
            include: [Member]
        })
            .then(() => {
                return Post.update(editPost, {
                    where: {
                        id: postid
                    }
                })
            })
            .then(() => {
                res.redirect('../creator')
            })
            .catch((err) => {
                res.send(err)
            })
    }
}

module.exports = Controller