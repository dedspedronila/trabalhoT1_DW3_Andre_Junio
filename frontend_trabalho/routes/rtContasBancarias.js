// Arquivo: ./routes/rtContasBancarias.js
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('contas_bancarias/vwLstContasBancarias', {
        title: 'Contas Bancarias',
        showNavbar: true,
        activeMenu: 'contas_bancarias',
        servidorDw3: process.env.SERVIDOR_DW3 // É necessário, pois, o front em html não acesso ao arquivo .env
    });
});

// Nova rota
router.get('/form', function(req, res) {
    res.render('contas_bancarias/vwFormContasBancarias', {
        title: 'Formulario de contas bancarias',
        showNavbar: true,
        activeMenu: 'contas_bancarias',
        servidorDw3: process.env.SERVIDOR_DW3
    });
});

module.exports = router;
