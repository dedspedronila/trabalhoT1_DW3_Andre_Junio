const db = require("../../../database/databaseconfig"); // importa o modulo de conexao com o banco de dados

const GetAllMovimentacoes = async () => { // busca todas as movimentacoes ativas do sistema
    return (
        await db.query(
            "SELECT *, (SELECT banco FROM contas_bancarias WHERE contaid = movimentacoes.contaid) AS nome_banco " + // busca o nome do banco relacionado a movimentacao
            "FROM movimentacoes WHERE deleted = false ORDER BY data_movimentacao DESC"
        )
    ).rows;
};

const GetMovimentacaoByID = async (movimentacaoIDPar) => { // busca uma movimentacao especifica pelo id
    return (
        await db.query(
            "SELECT *, (SELECT banco FROM contas_bancarias WHERE contaid = movimentacoes.contaid) AS nome_banco " +
            "FROM movimentacoes WHERE movimentacaoid = $1 AND deleted = false", // filtra pelo id da movimentacao
            [movimentacaoIDPar]
        )
    ).rows;
};

const InsertMovimentacao = async (movimentacaoREGPar) => { // cadastra uma nova movimentacao
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO movimentacoes (descricao, tipo, valor, data_movimentacao, contaid, deleted) " + // define as colunas da tabela e os valores que serao inseridos
                "VALUES ($1, $2, $3, $4, $5, $6)",
                [ // valores que serao inseridos
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
        msg = "[mdlMovimentacoes InsertMovimentacao] " + error.detail; // captura o erro especifico caso a insercao falhe
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const UpdateMovimentacao = async (movimentacaoIDPar, movimentacaoREGPar) => { // atualiza uma movimentacao
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = ( // executa a query de atualizacao no banco
            await db.query(
                "UPDATE movimentacoes SET " + // define as colunas que serao atualizadas
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

const DeleteMovimentacao = async (movimentacaoIDPar) => { // apaga logicamente uma movimentacao
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE movimentacoes SET deleted = true WHERE movimentacaoid = $1", // executa o soft delete da movimentacao
                [movimentacaoIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlMovimentacoes DeleteMovimentacao] " + error.detail; // captura o erro caso a exclusao falhe
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

module.exports = { // exporta os metodos para serem usados nas rotas
    GetAllMovimentacoes,
    GetMovimentacaoByID,
    InsertMovimentacao,
    UpdateMovimentacao,
    DeleteMovimentacao,
};
