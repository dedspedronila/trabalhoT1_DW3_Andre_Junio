// Arquivo: ./routes/rtMovimentacoes.js
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

// Nova rota
router.get('/form', function(req, res) {
    res.render('movimentacoes/vwFormMovimentacoes', {
        title: 'Formulario de movimentacoes',
        showNavbar: true,
        activeMenu: 'movimentacoes',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
