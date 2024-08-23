const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Venda = new Schema({
    user_nome: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    nome:{
        type: [String],
        required: true
    },
    prod_id:{
        type: [String],
        required: true
    },
    variacao:{
        type: [String]
    },
    especificidade:{
        type: [String]
    },
    origem:{
        type: [String]
    },
    qtd_venda:{
        type: [Number],
        required: true
    },
    preco_venda:{
        type: [Number],
        required: true
    },
    preco_qtd_venda:{
        type: [Number],
        required: true
    },
    somaP: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    _date: {
        type: Date,
        required: true
    }
})

mongoose.model('vendas', Venda)