//cria express e o router para criar as rotas
var express = require('express');
var router = express.Router();

//pega a rota /contas_bancarias e inicializa no site
router.get('/', function(req, res) {
    res.render('contas_bancarias/vwLstContasBancarias', {
        title: 'Contas Bancarias',
        showNavbar: true,
        activeMenu: 'contas_bancarias',
        servidorDw3: process.env.SERVIDOR_DW3 //puxa do back a conexão 
    });
});

//define uma rota GET para o caminho '/form' (ex: /contas_bancarias/form)
router.get('/form', function(req, res) {
    
    //renderiza o template HTML do formulário de contas bancárias
    res.render('contas_bancarias/vwFormContasBancarias', {
        title: 'Formulario de contas bancarias',
        showNavbar: true,
        activeMenu: 'contas_bancarias',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
