const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    nome: {
        type: String,
        required: true
    },
    ident: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        requierd: true
    },
    mode: {
        type: String,
        default: 'func'
    },
    foto: {
        type: String,
        default: 'default.png'
    },
    date: {
        type: String,
        required: true
    },
    _date: {
        type: Date
    }
})

mongoose.model('users', User)