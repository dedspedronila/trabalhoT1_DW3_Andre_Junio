//variavel recebe a bibliotecas do npm 
var createError = require('http-errors');
var express = require('express'); 
var path = require('path');
var nunjucks = require('nunjucks');

//variavel recebe o caminho da rota 
var indexRouter = require('./routes/rtIndex');
var loginRouter = require('./routes/rtLogin');
var homeRouter = require('./routes/rtHome');

//requisitando o que tem no .env
require('dotenv').config({ path: path.join(__dirname, 'frontend.env'), quiet: true });

//atribuindo um "valor"/ diretorio a variavel 
var app = express(); //cria uma instancia do express, para usar depois app.set, app.listen
var viewsPath = path.join(__dirname, 'views'); //path.join junta o caminho atual com a pasta descrita
var appsPath = path.join(__dirname, 'apps'); //junta o caminho do diretorio atual com a pasta apps

//uma constante que verifica o .env, se não tiver, pega o valor 40100 
const port = process.env.PORT || 40100;

//setando o caminho onde irá renderizar a pagina e já atribuindo que está no formato njk
app.set('views', [viewsPath, appsPath]);
app.set('view engine', 'njk');

//função que vincula o nunjucks junto ao express para rodar o frontend da pagina 
nunjucks.configure(viewsPath, {
    autoescape: true,
    express: app,
    noCache: app.get('env') === 'development'
});


//mostra ao servidor o que irá ser usado
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//mostra a rota ao servidor que o usuario irá utilizar e para onde ele irá
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);

//acusador de erro 404, puxa a mensagem de erro caso tente acessar uma rota que não existe 
app.use(function (req, res, next) {
    next(createError(404));
});

//acusador de erro moderno, erro especifico 
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { title: 'Erro' });
});

//func que liga/busca o server
app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})


