const mdlContasBancarias = require("../model/mdlContasBancarias");

const GetAllContasBancarias = (req, res) =>
    (async () => {
        let registro = await mdlContasBancarias.GetAllContasBancarias();
        res.json({ status: "ok", registro: registro });
    })();

const GetContaBancariaByID = (req, res) =>
    (async () => {
        const contaID = parseInt(req.params.contaid);
        let registro = await mdlContasBancarias.GetContaBancariaByID(contaID);
        res.json({ status: "ok", registro: registro });
    })();

const InsertContaBancaria = (request, res) =>
    (async () => {
        const contaREG = request.body;
        let { msg, linhasAfetadas } = await mdlContasBancarias.InsertContaBancaria(contaREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const UpdateContaBancaria = (request, res) =>
    (async () => {
        const contaID = parseInt(request.params.contaid);
        const contaREG = request.body;
        let { msg, linhasAfetadas } = await mdlContasBancarias.UpdateContaBancaria(contaID, contaREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const DeleteContaBancaria = (request, res) =>
    (async () => {
        const contaID = parseInt(request.params.contaid);
        let { msg, linhasAfetadas } = await mdlContasBancarias.DeleteContaBancaria(contaID);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

    const GetContasToMovimentacoes = (req, res) =>
    (async () => {
        let registro = await mdlContasBancarias.GetContasToMovimentacoes();
        res.json({ status: "ok", registro: registro });
    })();

module.exports = {
    GetAllContasBancarias,
    GetContaBancariaByID,
    InsertContaBancaria,
    UpdateContaBancaria,
    DeleteContaBancaria,
    GetContasToMovimentacoes
};
