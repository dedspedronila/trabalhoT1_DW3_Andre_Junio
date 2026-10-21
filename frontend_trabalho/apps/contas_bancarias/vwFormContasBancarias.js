//quando carregar a página: valida o login e define qual operação será feita 
//(criar, ler, atualizar ou deletar)
document.addEventListener('DOMContentLoaded', async function () {

    //verifica se o usuario está logado, se não, interrompe o cookie
    if (!dw3IsLogged()) {
        return;
    }
    //verifica o form. pelo id, se não encontrar, interrompe a sessão
    var form = document.getElementById('frmContasBancarias');
    if (!form) {
        return;
    }

    //verifica os parametros 
    var parametros = new URLSearchParams(window.location.search);

    //verifica qual operação será feita
    var oper = parametros.get('oper') || parametros.get('Oper');

    //puxa a url do servidor backend
    var servidorDw3 = form.dataset.servidorDw3;

    //armazena os botões
    var btnInserir = document.getElementById('btnInserirConta');
    var btnAtualizar = document.getElementById('btnAtualizarConta');
    var btnRemover = document.getElementById('btnRemoverConta');

    //se for operação para criar
    if (oper === 'Cr') {
        btnInserir.classList.remove('d-none'); //botao fica visivel
    }
    if (btnInserir) {
        btnInserir.addEventListener('click', function () {
            vwInsertContaBancaria();
        });
    }
    //se for operação para ler
    if (oper === 'Re') {
        vwGetContaBancariaByID();
    }

    //se for operação para atualizar
    if (oper === 'Up') {
        btnAtualizar.classList.remove('d-none');
        btnAtualizar.disabled = !(await vwGetContaBancariaByID());
        btnAtualizar.addEventListener('click', function () {
            vwUpdateContaBancaria();
        });
    }

    //se for operação para deletar
    if (oper === 'De') {
        btnRemover.classList.remove('d-none');
        btnRemover.disabled = !(await vwGetContaBancariaByID());
        btnRemover.addEventListener('click', function () {
            vwDeleteContaBancaria();
        });
    }
});

//função para inserir uma nova conta bancária no servidor via POST
async function vwInsertContaBancaria() {
    var form = document.getElementById('frmContasBancarias');
    var btnInserir = document.getElementById('btnInserirConta');
    try {
        //valida se os campos obrigatórios do formulário foram preenchidos
        if (!form.reportValidity()) {
            return;
        }
        var servidorDw3 = form.dataset.servidorDw3;
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        //desativa o botão para evitar cliques duplos
        if (btnInserir) {
            btnInserir.disabled = true;
        }
        //envia os dados do formulário para o backend
        var response = await fetch(servidorDw3 + '/insertContaBancaria', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarContaDoFormulario())
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel inserir a conta bancaria.');
        }
        var data = await response.json();

        //verifica se a sessão expirou
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel inserir a conta bancaria.');
        }

        //redireciona para a listagem após o sucesso
        window.location.href = '/contas_bancarias';
    } catch (error) {
        alert(error.message || 'Erro ao inserir conta bancaria.');
    } finally {
        //reativa o botão ao finalizar
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

//monta o objeto da conta bancária a partir dos campos do formulário
function montarContaDoFormulario() {
    return {
        banco: document.getElementById('banco').value,
        agencia: document.getElementById('agencia').value,
        numero_conta: document.getElementById('numero_conta').value,
        saldo: document.getElementById('saldo').value,
        ativo: document.getElementById('ativo').value === 'true',
        deleted: document.getElementById('deleted').value === 'true'
    };
}

//busca uma conta bancária pelo ID e preencher o formulário com os dados retornados do backend
async function vwGetContaBancariaByID() {
    var form = document.getElementById('frmContasBancarias');
    try {
        var parametros = new URLSearchParams(window.location.search);
        var contaId = parametros.get('contaId');
        var servidorDw3 = form.dataset.servidorDw3;

        //verifica se o ID da conta é um numero válido
        if (!contaId || !/^\d+$/.test(contaId) || Number(contaId) <= 0) {
            throw new Error('ID da conta bancaria invalido.');
        }
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }

        //faz a requisição GET para buscar a conta no servidor
        var response = await fetch(servidorDw3 + '/getContaBancariaByID/' + encodeURIComponent(contaId), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel carregar a conta bancaria.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }
        var conta = data.registro[0];
        if (!conta) {
            throw new Error('Conta bancaria nao encontrada.');
        }

        //preenche os campos do formulário com os dados obtidos
        document.getElementById('contaid').value = conta.contaid;
        document.getElementById('banco').value = conta.banco ?? '';
        document.getElementById('agencia').value = conta.agencia ?? '';
        document.getElementById('numero_conta').value = conta.numero_conta ?? '';
        document.getElementById('saldo').value = conta.saldo ?? '';
        document.getElementById('ativo').value = String(conta.ativo === true);
        document.getElementById('deleted').value = String(conta.deleted === true);
        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar conta bancaria.');
        return false;
    }
}

//atualiza os dados de uma conta existente no servidor via PUT
async function vwUpdateContaBancaria() {
    var form = document.getElementById('frmContasBancarias');
    var btnAtualizar = document.getElementById('btnAtualizarConta');
    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }
    try {
        var contaId = new URLSearchParams(window.location.search).get('contaId');
        var servidorDw3 = form.dataset.servidorDw3;

        //verifica se o botão esta desativado ou se o formulário é invalido
        if (!contaId || !/^\d+$/.test(contaId) || Number(contaId) <= 0) {
            throw new Error('ID da conta bancaria invalido.');
        }
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        btnAtualizar.disabled = true;
        var conta = montarContaDoFormulario();
        conta.saldo = Number(conta.saldo);

        //envia a requisição PUT com os novos dados
        var response = await fetch(servidorDw3 + '/updateContaBancaria/' + encodeURIComponent(contaId), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(conta)
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel atualizar a conta bancaria.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel atualizar a conta bancaria.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma conta bancaria foi atualizada.');
        }
        alert('Conta bancaria atualizada com sucesso.');
    } catch (error) {
        alert(error.message || 'Erro ao atualizar conta bancaria.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

//remove uma conta bancária do servidor via DELETE após confirmação
async function vwDeleteContaBancaria() {
    var form = document.getElementById('frmContasBancarias');
    var btnRemover = document.getElementById('btnRemoverConta');
    if (btnRemover.disabled) {
        return;
    }

    //exibe alerta de confirmação antes de excluir
    if (!window.confirm('Confirma a remoção desta conta bancaria?')) {
        return;
    }
    try {
        var contaId = document.getElementById('contaid').value;
        var servidorDw3 = form.dataset.servidorDw3;
        if (!contaId || !/^\d+$/.test(contaId) || Number(contaId) <= 0) {
            throw new Error('ID da conta bancaria invalido.');
        }
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        btnRemover.disabled = true;

        //envia a requisição DELETE para apagar o registro
        var response = await fetch(servidorDw3 + '/deleteContaBancaria/' + encodeURIComponent(contaId), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel remover a conta bancaria.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel remover a conta bancaria.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma conta bancaria foi removida.');
        }
        window.location.href = '/contas_bancarias';
    } catch (error) {
        alert(error.message || 'Erro ao remover conta bancaria.');
    } finally {
        btnRemover.disabled = false;
    }
}
