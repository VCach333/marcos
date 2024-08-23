const express = require('express')
const handlebars = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');

// Importando Arquivos
require('./models/User')
require('./models/Venda')
require('./config/auth')(passport);


const user = require('./routes/user')
const admin = require('./routes/admin')
const db = require('./config/db')
const User = mongoose.model('users')
const Venda = mongoose.model('vendas')
const { isAuthed } = require('./helpers/funcs');
const { isAdmin } = require('./helpers/funcs');



/* Conf. da App */
const app = express()

/* Sessão */
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));
/* Passport */
app.use(passport.initialize());
app.use(passport.session());
/* Flash */
app.use(flash())
/* Middleware */
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});
/* HandleBars */
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
/* BodyParser */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
/* Arquivos Estáticos */
app.use(express.static(path.join(__dirname, 'public')))
/* Mongoose */
mongoose.Promise = global.Promise

mongoose.connect(db.MongoURI, {
    useMongoClient: true
}).then(() => {
    console.log('MongoDB Conectado...')
}).catch((err) => {
    console.log('Erro ao Conectar com o Banco de Dados - ' + err)
})


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

    if (how == 'hour') {
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


app.post('/admin/cadastro', (req, res) => {
    User.findOne({ mode: 'admin' }).lean().then((admin) => {
        if (admin) {
            res.redirect('/user/login')
        } else {
            const user_cad = {
                nome: 'Administrador',
                ident: 'admin',
                mode: 'admin',
                foto: 'admin.png',
                morada: 'Luanda',
                senha: '123456',
                date: globalDate('large'),
                _date: Date.now()
            }

            new User(user_cad).save().then(() => {
                res.redirect('/user/login')
            }).catch((err) => {
                console.log('Houve um Erro - ' + err)
                res.redirect('/user/login')
            })
        }
    }).catch((err) => {
        console.log('Houve um Erro - ' + err)
        res.redirect('/user/login')
    })
})

app.get('/', (req, res) => {
    var admin
    if (req.user) {
        if (req.user.mode == 'admin') {
            admin = 'admin'
        }
    }
    res.render('home')
})

app.get('/info', (req, res) => {
    var admin
    if (req.user) {
        if (req.user.mode == 'admin') {
            admin = 'admin'
        }
    }
    res.render('info', { admin: admin })
})


const PORT = process.env.PORT || 3019
app.listen(PORT, () => {
    console.log('Servidor rodando  -- localhost:' + PORT)
})

app.use('/user', user)
app.use('/admin', admin)