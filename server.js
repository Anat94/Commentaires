let express = require('express');
let app = express();
let session = require('express-session');

app.use(session({
  secret: 'abcdefghijklmnopqrstuvwxyz',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(require('./middlewares/flash.js'));

app.set('view engine', 'ejs');

app.use('/assets', express.static('public'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    let Message = require('./Models/message');
    Message.all(function (messages) {
        res.render('pages/index', {messages: messages});
    });
});

app.post('/', (req, res) => {
    if (req.body.message === undefined || req.body.message === '') {
        req.session.error = "Il y a une erreure";
        req.flash('error', 'Merci de rentrer un message !')
        res.redirect('/');
    } else {
        let Message = require('./Models/message');
        Message.create(req.body.message, function() {
            req.flash('succes', 'Merci !');
            res.redirect('/');
        });
    }
});

app.get('/message/:id', (req, res) => {
    res.send(req.params.id);
});

app.listen(8000);