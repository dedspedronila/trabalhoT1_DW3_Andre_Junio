const express = require("express");
const routerApp = express.Router(); // instancia o roteador do express

const appLogin = require("../apps/login/controller/ctlLogin"); // importa o controller de autenticacao e login
const appContasBancarias = require("../apps/contas_bancarias/controller/ctlContasBancarias"); // importa o controller do modulo de contas bancarias
const appMovimentacoes = require("../apps/movimentacoes/controller/ctlMovimentacoes"); // importa o controller do modulo de movimentacoes

routerApp.use((req, res, next) => { // middleware intermediario para interceptar as requisicoes do roteador
    next(); // segue para rota seguinte
});

routerApp.get("/", (req, res) => { //rota basica para testes
    res.send("Olá mundo!");
});

routerApp.post("/Login", appLogin.Login); // rota publica para autenticar usuario e gerar o token
routerApp.post("/Logout", appLogin.Logout); //rota publica para encerrar sessao

routerApp.get("/getAllContasBancarias", appLogin.AutenticaJWT, appContasBancarias.GetAllContasBancarias); //rota protegida para listar todas as contas ativas
routerApp.get("/getContaBancariaByID/:contaid", appLogin.AutenticaJWT, appContasBancarias.GetContaBancariaByID); //"""" busca uma conta pelo id
routerApp.post("/insertContaBancaria", appLogin.AutenticaJWT, appContasBancarias.InsertContaBancaria); //"""" insere uma nova conta
routerApp.put("/updateContaBancaria/:contaid", appLogin.AutenticaJWT, appContasBancarias.UpdateContaBancaria); //"""" atualiza uma conta
routerApp.delete("/deleteContaBancaria/:contaid", appLogin.AutenticaJWT, appContasBancarias.DeleteContaBancaria); //"""" apaga logicamente uma conta
routerApp.get("/getContasToMovimentacoes", appLogin.AutenticaJWT, appContasBancarias.GetContasToMovimentacoes); // rota auxiliar para alimentar o select no cadastro de movimentacoes

routerApp.get("/getAllMovimentacoes", appLogin.AutenticaJWT, appMovimentacoes.GetAllMovimentacoes); //rota protegida para listar todas as movimentacoes
routerApp.get("/getMovimentacaoByID/:movimentacaoid", appLogin.AutenticaJWT, appMovimentacoes.GetMovimentacaoByID); //"""" busca uma movimentacao pelo id
routerApp.post("/insertMovimentacao", appLogin.AutenticaJWT, appMovimentacoes.InsertMovimentacao); // """" insere uma nova movimentacao
routerApp.put("/updateMovimentacao/:movimentacaoid", appLogin.AutenticaJWT, appMovimentacoes.UpdateMovimentacao); //"""" atualiza uma movimentacao
routerApp.delete("/deleteMovimentacao/:movimentacaoid", appLogin.AutenticaJWT, appMovimentacoes.DeleteMovimentacao); //"""" apaga logicamente uma movimentacao

module.exports = routerApp;
