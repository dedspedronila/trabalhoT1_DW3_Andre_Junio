const mdlMovimentacoes = require("../model/mdlMovimentacoes");

const GetAllMovimentacoes = (req, res) =>
    (async () => {
        let registro = await mdlMovimentacoes.GetAllMovimentacoes();
        for (let i = 0; i < registro.length; i++) {
            const row = registro[i];
            if (row.data_movimentacao) {
                const formattedDate = row.data_movimentacao.toISOString().split('T')[0];
                row.data_movimentacao = formattedDate;
            }
        }
        res.json({ status: "ok", registro: registro });
    })();

const GetMovimentacaoByID = (req, res) =>
    (async () => {
        const movimentacaoID = parseInt(req.params.movimentacaoid);
        let registro = await mdlMovimentacoes.GetMovimentacaoByID(movimentacaoID);
        if (registro.length > 0 && registro[0].data_movimentacao) {
            registro[0].data_movimentacao = registro[0].data_movimentacao.toISOString().split('T')[0];
        }
        res.json({ status: "ok", registro: registro });
    })();

const InsertMovimentacao = (request, res) =>
    (async () => {
        const movimentacaoREG = request.body;
        let { msg, linhasAfetadas } = await mdlMovimentacoes.InsertMovimentacao(movimentacaoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const UpdateMovimentacao = (request, res) =>
    (async () => {
        const movimentacaoID = parseInt(request.params.movimentacaoid);
        const movimentacaoREG = request.body;
        let { msg, linhasAfetadas } = await mdlMovimentacoes.UpdateMovimentacao(movimentacaoID, movimentacaoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const DeleteMovimentacao = (request, res) =>
    (async () => {
        const movimentacaoID = parseInt(request.params.movimentacaoid);
        let { msg, linhasAfetadas } = await mdlMovimentacoes.DeleteMovimentacao(movimentacaoID);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

module.exports = {
    GetAllMovimentacoes,
    GetMovimentacaoByID,
    InsertMovimentacao,
    UpdateMovimentacao,
    DeleteMovimentacao,
};
