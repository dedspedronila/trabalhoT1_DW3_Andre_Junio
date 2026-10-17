const db = require("../../../database/databaseconfig");

const GetAllContasBancarias = async () => {
    return (
        await db.query(
            "SELECT * FROM contas_bancarias WHERE deleted = false ORDER BY banco ASC"
        )
    ).rows;
};

const GetContaBancariaByID = async (contaIDPar) => {
    return (
        await db.query(
            "SELECT * FROM contas_bancarias WHERE contaid = $1 AND deleted = false",
            [contaIDPar]
        )
    ).rows;
};

const InsertContaBancaria = async (contaREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "INSERT INTO contas_bancarias (banco, agencia, numero_conta, saldo, ativo, deleted) " +
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
    } catch (error) {
        msg = "[mdlContasBancarias InsertContaBancaria] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const UpdateContaBancaria = async (contaIDPar, contaREGPar) => {
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
                "WHERE contaid = $1",
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

const DeleteContaBancaria = async (contaIDPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                "UPDATE contas_bancarias SET deleted = true WHERE contaid = $1",
                [contaIDPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlContasBancarias DeleteContaBancaria] " + error.detail;
        linhasAfetadas = -1;
    }
    return { msg, linhasAfetadas };
};

const GetContasToMovimentacoes = async () => {
    return (
        await db.query(
            "SELECT contaid, banco, numero_conta FROM contas_bancarias WHERE deleted = false AND ativo = true ORDER BY banco ASC"
        )
    ).rows;
};

module.exports = {
    GetAllContasBancarias,
    GetContaBancariaByID,
    InsertContaBancaria,
    UpdateContaBancaria,
    DeleteContaBancaria,
    GetContasToMovimentacoes
};
