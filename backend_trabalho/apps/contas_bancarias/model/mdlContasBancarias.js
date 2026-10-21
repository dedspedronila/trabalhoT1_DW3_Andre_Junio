const db = require("../../../database/databaseconfig"); //importa a conexao com o banco de dados

const GetAllContasBancarias = async () => { //busca todas as contas que estão ativas
    return (
        await db.query( //executa o comando abaixo
            "SELECT * FROM contas_bancarias WHERE deleted = false ORDER BY banco ASC"
        )
    ).rows; //retorna as linhas encontradas
};

const GetContaBancariaByID = async (contaIDPar) => { // busca uma conta pelo id
    return (
        await db.query(
            "SELECT * FROM contas_bancarias WHERE contaid = $1 AND deleted = false", // filtra pelo id
            [contaIDPar]
        )
    ).rows;
};

const InsertContaBancaria = async (contaREGPar) => { // insere uma nova conta no banco
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO contas_bancarias (banco, agencia, numero_conta, saldo, ativo, deleted) " + // define as colunas da tabela e os valores que serao inseridos
                "VALUES ($1, $2, $3, $4, $5, $6)",
                [
                    contaREGPar.banco,
                    contaREGPar.agencia,
                    contaREGPar.numero_conta,
                    contaREGPar.saldo,
                    contaREGPar.ativo,
                    contaREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {  // captura erros caso a insercao falhe
        msg = "[mdlContasBancarias InsertContaBancaria] " + error.detail; //mostra o erro especifico
        linhasAfetadas = -1; // mostra a falha na insercao
    }
    return { msg, linhasAfetadas };
};

const UpdateContaBancaria = async (contaIDPar, contaREGPar) => { // atualiza uma conta existente
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE contas_bancarias SET " +
                "banco = $2, " +
                "agencia = $3, " +
                "numero_conta = $4, " +
                "saldo = $5, " +
                "ativo = $6, " +
                "deleted = $7 " +
                "WHERE contaid = $1", // aplica a mudanca apenas na conta com o id informado
                [
                    contaIDPar,
                    contaREGPar.banco,
                    contaREGPar.agencia,
                    contaREGPar.numero_conta,
                    contaREGPar.saldo,
                    contaREGPar.ativo,
                    contaREGPar.deleted,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContasBancarias UpdateContaBancaria] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const DeleteContaBancaria = async (contaIDPar) => { // executa a exclusao logica da conta
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE contas_bancarias SET deleted = true WHERE contaid = $1", // marca o campo deleted como true sem apagar o registro fisicamente
                [contaIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContasBancarias DeleteContaBancaria] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const GetContasToMovimentacoes = async () => { // busca contas disponiveis para vincular na movimentacao
    return (
        await db.query(
            "SELECT contaid, banco, numero_conta FROM contas_bancarias WHERE deleted = false AND ativo = true ORDER BY banco ASC" // traz apenas os campos basicos para as movimentacoes
        )
    ).rows;
};

module.exports = { // exporta as funcoes para o controller utilizar
    GetAllContasBancarias,
    GetContaBancariaByID,
    InsertContaBancaria,
    UpdateContaBancaria,
    DeleteContaBancaria,
    GetContasToMovimentacoes
};
