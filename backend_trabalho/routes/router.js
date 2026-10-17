const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");
const appContasBancarias = require("../apps/contas_bancarias/controller/ctlContasBancarias");
const appMovimentacoes = require("../apps/movimentacoes/controller/ctlMovimentacoes");

routerApp.use((req, res, next) => {
    next();
});

routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
});

routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

routerApp.get("/getAllContasBancarias", appLogin.AutenticaJWT, appContasBancarias.GetAllContasBancarias);
routerApp.get("/getContaBancariaByID/:contaid", appLogin.AutenticaJWT, appContasBancarias.GetContaBancariaByID);
routerApp.post("/insertContaBancaria", appLogin.AutenticaJWT, appContasBancarias.InsertContaBancaria);
routerApp.put("/updateContaBancaria/:contaid", appLogin.AutenticaJWT, appContasBancarias.UpdateContaBancaria);
routerApp.delete("/deleteContaBancaria/:contaid", appLogin.AutenticaJWT, appContasBancarias.DeleteContaBancaria);
routerApp.get("/getContasToMovimentacoes", appLogin.AutenticaJWT, appContasBancarias.GetContasToMovimentacoes);

routerApp.get("/getAllMovimentacoes", appLogin.AutenticaJWT, appMovimentacoes.GetAllMovimentacoes);
routerApp.get("/getMovimentacaoByID/:movimentacaoid", appLogin.AutenticaJWT, appMovimentacoes.GetMovimentacaoByID);
routerApp.post("/insertMovimentacao", appLogin.AutenticaJWT, appMovimentacoes.InsertMovimentacao);
routerApp.put("/updateMovimentacao/:movimentacaoid", appLogin.AutenticaJWT, appMovimentacoes.UpdateMovimentacao);
routerApp.delete("/deleteMovimentacao/:movimentacaoid", appLogin.AutenticaJWT, appMovimentacoes.DeleteMovimentacao);

module.exports = routerApp;
