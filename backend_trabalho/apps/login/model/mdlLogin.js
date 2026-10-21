const db = require("../../../database/databaseconfig"); // importa o modulo de conexao com o banco de dados
const GetCredencial = async (loginPar) => { // busca os dados de autenticacao pelo username
    return (
        await db.query(
            "select username, password " + // seleciona os campos de usuario e senha com hash
            "from usuarios where username = $1 and deleted = false", [loginPar]
        )
    ).rows;
};
//--$
module.exports = { // exporta a funcao para ser usada no controller de login
    GetCredencial,
};
