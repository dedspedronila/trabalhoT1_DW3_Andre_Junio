//cria express e o router para criar as rotas
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('movimentacoes/vwLstMovimentacoes', {
        title: 'Movimentações',
        showNavbar: true,
        activeMenu: 'movimentacoes',
        servidorDw3: process.env.SERVIDOR_DW3 // É necessário, pois, o front em html não acesso ao arquivo .env
    });
});

//define uma rota GET para o caminho '/form' dentro de movimentações (ex: /movimentacoes/form)
router.get('/form', function(req, res) {

    //renderiza o template HTML do formulário de movimentações
    res.render('movimentacoes/vwFormMovimentacoes', {
        title: 'Formulario de movimentacoes',
        showNavbar: true,
        activeMenu: 'movimentacoes',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

//exporta para termos o acesso ao arquivo
module.exports = router;
