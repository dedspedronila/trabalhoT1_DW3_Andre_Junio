const mdlContasBancarias = require("../model/mdlContasBancarias"); // importa as funcoes de banco do model de contas bancarias

const GetAllContasBancarias = (req, res) => // rota para listar todas as contas bancarias
    (async () => { // funcao assincrona autoexecutavel para esperar o banco
        let registro = await mdlContasBancarias.GetAllContasBancarias();  // busca a lista de contas no model
        res.json({ status: "ok", registro: registro }); // devolve a resposta padrao com os registros encontrados
    })();

const GetContaBancariaByID = (req, res) => // rota para buscar uma conta pelo id
    (async () => {
        const contaID = parseInt(req.params.contaid); // converte o id recebido pela url em numero inteiro
        let registro = await mdlContasBancarias.GetContaBancariaByID(contaID); //consulta a conta especifica
        res.json({ status: "ok", registro: registro });
    })();

const InsertContaBancaria = (request, res) => // rota para cadastrar uma nova conta
    (async () => {
        const contaREG = request.body; // pega os dados enviados no corpo da requisicao
        let { msg, linhasAfetadas } = await mdlContasBancarias.InsertContaBancaria(contaREG); //chama o model para inserir e pega o retorno
        res.json({ status: msg, linhasAfetadas: linhasAfetadas }); // responde com o status e quantas linhas foram afetadas
    })();

const UpdateContaBancaria = (request, res) =>  // rota para atualizar uma conta existente
    (async () => {
        const contaID = parseInt(request.params.contaid);
        const contaREG = request.body;
        let { msg, linhasAfetadas } = await mdlContasBancarias.UpdateContaBancaria(contaID, contaREG); //envia o id e dados atualizados
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const DeleteContaBancaria = (request, res) =>  // rota para apagar logicamente a conta
    (async () => {
        const contaID = parseInt(request.params.contaid);
        let { msg, linhasAfetadas } = await mdlContasBancarias.DeleteContaBancaria(contaID); // executa o soft delete
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

    const GetContasToMovimentacoes = (req, res) => // rota auxiliar para alimentar o select no cadastro de movimentacoes
    (async () => {
        let registro = await mdlContasBancarias.GetContasToMovimentacoes(); //busca lista de contas ativas
        res.json({ status: "ok", registro: registro });
    })();

module.exports = { // exporta os controllers para serem usados nas rotas
    GetAllContasBancarias,
    GetContaBancariaByID,
    InsertContaBancaria,
    UpdateContaBancaria,
    DeleteContaBancaria,
    GetContasToMovimentacoes
};
