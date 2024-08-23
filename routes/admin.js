const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')

/* Conf. da Rota */
    const router = express.Router()

/* Importando Arquivos */
    require('../models/Venda')
    require('../models/User')
    
    const db = require('../config/db')
    const Venda = mongoose.model('vendas')
    const User = mongoose.model('users')
    const {isAuthed} = require('../helpers/funcs')
    const {isAdmin} = require('../helpers/funcs')

    function globalDate(how) {
        var day = new Date().getDate()
        if (Number(day) < 10) { day = '0' + day }
        var dayS = new Date().getDay().toString().replace('0', 'Dom').replace('1', 'Seg').replace('2', 'Ter').replace('3', 'Qua').replace('4', 'Qui').replace('5', 'Sex').replace('6', 'Sáb')
        var _month = new Date().getMonth()
        var month = Number(_month + 1)
        var monthS = month.toString().replace('1', 'Jan').replace('2', 'Fev').replace('3', 'Mar').replace('4', 'Abr').replace('5', 'Mai').replace('6', 'Jun').replace('7', 'Jul').replace('8', 'Ago').replace('9', 'Set').replace('10', 'Out').replace('11', 'Nov').replace('12', 'Dez')
        var year = new Date().getFullYear()
        var hour = new Date().getHours()
        var minute = new Date().getMinutes()
        var seconds = new Date().getSeconds()


        if(how == 'hour') {
            var global_date = hour + ':' + minute + ':' + seconds
        } else if (how == 'vsmall') {
            var global_date = day + ' · ' + month + ' · ' + year
        } else if (how == 'small') {
            var global_date = day + ' · ' + month + ' · ' + year + ' | ' + hour
        } else if (how == 'medium') {
            var global_date = dayS + ' · ' + day + ' · ' + monthS + ' · ' + year + ' | ' + hour + 'h'
        } else if (how == 'large') {
            var global_date = dayS + ' · ' + day + ' · ' + monthS + ' · ' + year + ' | ' + hour + ':' + minute
        }

        return global_date
    }


router.get('/users', isAdmin, (req, res) => {
    User.find({mode: 'admin'}).sort({date: 'desc'}).lean().then((admins) => {
        User.find({mode: 'admin'}).count().lean().then((admins_count) => {
            User.find({mode: 'func'}).sort({date: 'desc'}).lean().then((users) => {
                User.find({mode: 'func'}).count().lean().then((users_count) => {
                    User.find({mode: 'func', status: 'online'}).count().lean().then((users_online_count) => {
                        UserReserva.find().lean().then((users_reserva) => {
                            res.render('admin/users', {admin: 'admin', users: users, users_count: users_count, admins: admins, admins_count: admins_count, users_online_count: users_online_count, users_reserva: users_reserva})
                        }).catch((err) => {
                            console.error('Houve um Erro - ' + err)
                            res.redirect('/user/perfil')
                        })
                    }).catch((err) => {
                        console.error('Houve um Erro - ' + err)
                        res.redirect('/user/perfil')
                    })
                }).catch((err) => {
                    console.error('Houve um Erro - ' + err)
                    res.redirect('/user/perfil')
                })
            }).catch((err) => {
                console.error('Houve um Erro - ' + err)
                res.redirect('/user/perfil')
            })
        }).catch((err) => {
            console.error('Houve um Erro - ' + err)
            res.redirect('/user/perfil')
        })
    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        res.redirect('/user/perfil')
    })
})

router.post('/user/delete/:ident', isAdmin, (req, res) => {
    User.deleteOne({ident: req.params.ident}).then(() => {
        res.redirect('/admin/users')
    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        res.redirect('/admin/users')
    })
})

router.post('/cadastro/admin/:ident', isAdmin, (req, res) => {
    User.findOne({ident: req.params.ident}).then((user) => {
        user.mode = 'admin'

        user.save().then(() => {
            res.redirect('/admin/users')
        }).catch((err) => {
            console.error('Houve um Erro - ' + err)
            res.redirect('/admin/users')
        })
    }).catch((err) => {
        console.error('Houve um Erro - ' + err)
        res.redirect('/admin/users')
    })
})

router.post('/delete/admin/:ident', isAdmin, (req, res) => {
    if(req.params.ident == 'admin_exclusivo_ident') {
        console.log('Tentativa de Remover Admin Exclusivo!!!')
        console.log(req.user)
        
    } else {
        User.findOne({ident: req.params.ident}).then((user) => {
            user.mode = 'func'
    
            user.save().then(() => {
                res.redirect('/admin/users')
            }).catch((err) => {
                console.error('Houve um Erro - ' + err)
                res.redirect('/admin/users')
            })
        }).catch((err) => {
            console.error('Houve um Erro - ' + err)
            res.redirect('/admin/users')
        })
    }
})

module.exports = router