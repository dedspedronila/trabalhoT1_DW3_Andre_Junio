const jwt = require("jsonwebtoken"); // importa o modulo de criacao e verificacao de tokens JWT
const bCrypt = require("bcryptjs"); // importa o modulo de criptografia para comparacao segura
const mdlLogin = require("../model/mdlLogin"); // importa as funcoes de banco do model de login
const Login = async (req, res, next) => { // rota para autenticar o usuario e gerar o token JWT
    const credencial = await mdlLogin.GetCredencial(req.body.username); // busca a credencial do usuario no banco de dados
    if (credencial.length == 0) { // ve se a credencial existe
        return res.status(200).json({ message: "Usuário não identificado!" });

    }
    if (bCrypt.compareSync(req.body.password, credencial[0].password)) { // compara a senha recebida com a senha criptografada no banco
        //auth ok
        const username = credencial[0].username; // pega o nome de usuario para incluir no payload do token
        const token = jwt.sign({ username }, process.env.SECRET_API, { //cria o token jwt com o nome de usuario e a chave secreta definida no .env
            expiresIn: 600, // expira em 10 minutos
        });
        return res.json({ auth: true, token: token });
    }
    res.status(200).json({ message: "Login inválido!" });
};
function AutenticaJWT(req, res, next) { // middleware para verificar se o token JWT enviado na requisicao e valido
    const tokenHeader = req.headers["authorization"]; // pega o token do cabecalho da requisicao
    if (!tokenHeader) //verifica se o token está presente
        return res.status(200).json({ auth: false, message: "Não foi informado o token JWT" });   // barra o acesso caso o token nao seja informado
    const bearer = tokenHeader.split(" "); // divide a string para separar a palavra bearer do token
    const token = bearer[1]; // extrai apenas o hash do token jwt
    jwt.verify(token, process.env.SECRET_API, function (err, decoded) { // valida a autenticidade e validade do token
        if (err)
            return res.status(200)
                .json({ auth: false, message: "JWT inválido ou expirado" });
        req.userId = decoded.id;
        next();
    });
}
const Logout = (req, res, next) => { // rota para realizar o encerramento da sessao
    res.json({ auth: false, token: null }); // retorna o token nulo sinalizando o logout
};
module.exports = { // exporta as funcoes de autenticacao para o arquivo de rotas
    Login,
    Logout,
    AutenticaJWT,
};
