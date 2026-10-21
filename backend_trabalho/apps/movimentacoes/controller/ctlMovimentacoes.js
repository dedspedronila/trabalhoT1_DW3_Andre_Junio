const mdlMovimentacoes = require("../model/mdlMovimentacoes"); // importa as funcoes de banco do model de movimentacoes

const GetAllMovimentacoes = (req, res) => // rota para listar todas as movimentacoes
    (async () => {
        let registro = await mdlMovimentacoes.GetAllMovimentacoes(); // busca todas as movimentacoes
        for (let i = 0; i < registro.length; i++) {
            const row = registro[i];
            if (row.data_movimentacao) {
                const formattedDate = row.data_movimentacao.toISOString().split('T')[0]; // converte a data para formato aaaa-mm-dd
                row.data_movimentacao = formattedDate; // atualiza a data com o formato correto
            }
        }
        res.json({ status: "ok", registro: registro }); //devolve as movimentacoes
    })();

const GetMovimentacaoByID = (req, res) =>  // rota para buscar uma movimentacao pelo id
    (async () => {
        const movimentacaoID = parseInt(req.params.movimentacaoid);
        let registro = await mdlMovimentacoes.GetMovimentacaoByID(movimentacaoID); // busca o registro
        if (registro.length > 0 && registro[0].data_movimentacao) { // confere se encontrou algo e se a data existe
            registro[0].data_movimentacao = registro[0].data_movimentacao.toISOString().split('T')[0]; // converte a data para formato aaaa-mm-dd
        }
        res.json({ status: "ok", registro: registro });
    })();

const InsertMovimentacao = (request, res) => // rota para cadastrar uma nova
    (async () => {
        const movimentacaoREG = request.body;
        let { msg, linhasAfetadas } = await mdlMovimentacoes.InsertMovimentacao(movimentacaoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const UpdateMovimentacao = (request, res) => // rota para atualizar uma movimentacao
    (async () => {
        const movimentacaoID = parseInt(request.params.movimentacaoid);
        const movimentacaoREG = request.body; // recebe os novos dados enviados
        let { msg, linhasAfetadas } = await mdlMovimentacoes.UpdateMovimentacao(movimentacaoID, movimentacaoREG); //faz a atualizacao no model
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const DeleteMovimentacao = (request, res) => // rota para apagar logicamente a movimentacao
    (async () => {
        const movimentacaoID = parseInt(request.params.movimentacaoid);
        let { msg, linhasAfetadas } = await mdlMovimentacoes.DeleteMovimentacao(movimentacaoID); // faz o soft delete no model
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

module.exports = {  // exporta os metodos do controller para as rotas
    GetAllMovimentacoes,
    GetMovimentacaoByID,
    InsertMovimentacao,
    UpdateMovimentacao,
    DeleteMovimentacao,
};
