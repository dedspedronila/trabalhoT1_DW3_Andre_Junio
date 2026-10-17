const db = require("../../../database/databaseconfig");

const GetAllMovimentacoes = async () => {
    return (
        await db.query(
            "SELECT *, (SELECT banco FROM contas_bancarias WHERE contaid = movimentacoes.contaid) AS nome_banco " +
            "FROM movimentacoes WHERE deleted = false ORDER BY data_movimentacao DESC"
        )
    ).rows;
};

const GetMovimentacaoByID = async (movimentacaoIDPar) => {
    return (
        await db.query(
            "SELECT *, (SELECT banco FROM contas_bancarias WHERE contaid = movimentacoes.contaid) AS nome_banco " +
            "FROM movimentacoes WHERE movimentacaoid = $1 AND deleted = false",
            [movimentacaoIDPar]
        )
    ).rows;
};

const InsertMovimentacao = async (movimentacaoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO movimentacoes (descricao, tipo, valor, data_movimentacao, contaid, deleted) " +
                "VALUES ($1, $2, $3, $4, $5, $6)",
                [
                    movimentacaoREGPar.descricao,
                    movimentacaoREGPar.tipo,
                    movimentacaoREGPar.valor,
                    movimentacaoREGPar.data_movimentacao,
                    movimentacaoREGPar.contaid,
                    movimentacaoREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlMovimentacoes InsertMovimentacao] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const UpdateMovimentacao = async (movimentacaoIDPar, movimentacaoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE movimentacoes SET " +
                "descricao = $2, " +
                "tipo = $3, " +
                "valor = $4, " +
                "data_movimentacao = $5, " +
                "contaid = $6, " +
                "deleted = $7 " +
                "WHERE movimentacaoid = $1",
                [
                    movimentacaoIDPar,
                    movimentacaoREGPar.descricao,
                    movimentacaoREGPar.tipo,
                    movimentacaoREGPar.valor,
                    movimentacaoREGPar.data_movimentacao,
                    movimentacaoREGPar.contaid,
                    movimentacaoREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlMovimentacoes UpdateMovimentacao] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const DeleteMovimentacao = async (movimentacaoIDPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE movimentacoes SET deleted = true WHERE movimentacaoid = $1",
                [movimentacaoIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlMovimentacoes DeleteMovimentacao] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

module.exports = {
    GetAllMovimentacoes,
    GetMovimentacaoByID,
    InsertMovimentacao,
    UpdateMovimentacao,
    DeleteMovimentacao,
};
