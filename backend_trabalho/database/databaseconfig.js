const Pool = require('pg').Pool // importa o driver do postgres para gerenciar conexoes
const pool = new Pool({ // cria o pool de conexao usando as variaveis de ambiente
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
})
module.exports = { // exporta a funcao de consulta para executar sql usando o pool
    query: (text, params) => pool.query(text, params),
};
