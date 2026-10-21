// Arquivo: apps/movimentacoes/vwFormMovimentacoes.js
document.addEventListener('DOMContentLoaded', async function() {
    if (!dw3IsLogged()) {
        return;
    }
    var form = document.getElementById('frmMovimentacoes');
    if (!form) {
        return;
    }
    var parametros = new URLSearchParams(window.location.search);
    var oper = parametros.get('oper') || parametros.get('Oper');
    var servidorDw3 = form.dataset.servidorDw3;
    var btnInserir = document.getElementById('btnInserirMovimentacao');
    var btnAtualizar = document.getElementById('btnAtualizarMovimentacao');
    var btnRemover = document.getElementById('btnRemoverMovimentacao');
    inicializarSelectContas();
    if (oper === 'Cr') {
        btnInserir.classList.remove('d-none'); // Torna o Botão visível.
        carregarContasToMovimentacoes(servidorDw3);
    }
    if (btnInserir) {
        btnInserir.addEventListener('click', function() {
            vwInsertMovimentacao();
        });
    }
    if (oper === 'Re') {
        vwGetMovimentacaoByID();
    }
    if (oper === 'Up') {
        btnAtualizar.classList.remove('d-none');
        btnAtualizar.disabled = !(await vwGetMovimentacaoByID());
        btnAtualizar.addEventListener('click', function() {
            vwUpdateMovimentacao();
        });
    }
    if (oper === 'De') {
        btnRemover.classList.remove('d-none');
        btnRemover.disabled = !(await vwGetMovimentacaoByID());
        btnRemover.addEventListener('click', function() {
            vwDeleteMovimentacao();
        });
    }
});

// Aqui é inicializado o componente Select2.js em branco
function inicializarSelectContas() {
    $('#contaid').select2({
        theme: 'bootstrap-5',
        placeholder: 'Selecione uma conta',
        width: '100%'
    });
}

// Aqui é preenchido o componente Select2 com as contas disponíveis
async function carregarContasToMovimentacoes(servidorDw3) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereço do servidor backend nao configurado.');
        }
        var response = await fetch(servidorDw3 + '/getContasToMovimentacoes', {
            headers: dw3MontarHeadersAutenticacao() // Função que está no arquivo public/js/frontend.js
        });
        if (!response.ok) {
            throw new Error('Não foi possivel carregar as contas.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessão expirada. Faca login novamente.');
        }
        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }
        preencherSelectContas(data.registro);
    } catch (error) {
        alert(error.message || 'Erro ao carregar contas.');
    }
}

function preencherSelectContas(contas) {
    var contaSelect = document.getElementById('contaid');
    if (!contaSelect) {
        return;
    }
    contaSelect.innerHTML = '<option value="">Selecione uma conta</option>';
    contas.forEach(function(conta) {
        var option = document.createElement('option');
        option.value = conta.contaid;
        option.textContent = conta.banco + ' - ' + conta.numero_conta;
        contaSelect.appendChild(option);
    });
    $('#contaid').trigger('change');
}

async function vwInsertMovimentacao() {
    var form = document.getElementById('frmMovimentacoes');
    var btnInserir = document.getElementById('btnInserirMovimentacao');
    try {
        if (!form.reportValidity()) {
            return;
        }
        var servidorDw3 = form.dataset.servidorDw3;
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        if (btnInserir) {
            btnInserir.disabled = true;
        }
        var response = await fetch(servidorDw3 + '/insertMovimentacao', {
            method: 'POST',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(montarMovimentacaoDoFormulario())
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel inserir a movimentacao.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel inserir a movimentacao.');
        }
        window.location.href = '/movimentacoes';
    } catch (error) {
        alert(error.message || 'Erro ao inserir movimentacao.');
    } finally {
        if (btnInserir) {
            btnInserir.disabled = false;
        }
    }
}

function montarMovimentacaoDoFormulario() {
    return {
        descricao: document.getElementById('descricao').value,
        tipo: document.getElementById('tipo').value,
        valor: document.getElementById('valor').value,
        data_movimentacao: document.getElementById('data_movimentacao').value,
        contaid: document.getElementById('contaid').value,
        deleted: document.getElementById('deleted').value === 'true'
    };
}

async function vwGetMovimentacaoByID() {
    var form = document.getElementById('frmMovimentacoes');
    try {
        var parametros = new URLSearchParams(window.location.search);
        var movimentacaoId = parametros.get('movimentacaoId');
        var servidorDw3 = form.dataset.servidorDw3;
        if (!movimentacaoId || !/^\d+$/.test(movimentacaoId) || Number(movimentacaoId) <= 0) {
            throw new Error('ID da movimentacao invalido.');
        }
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        var response = await fetch(servidorDw3 + '/getMovimentacaoByID/' + encodeURIComponent(movimentacaoId), {
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            })
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel carregar a movimentacao.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }
        var movimentacao = data.registro[0];
        if (!movimentacao) {
            throw new Error('Movimentacao nao encontrada.');
        }
        document.getElementById('movimentacaoid').value = movimentacao.movimentacaoid;
        document.getElementById('descricao').value = movimentacao.descricao ?? '';
        document.getElementById('tipo').value = movimentacao.tipo ?? '';
        document.getElementById('valor').value = movimentacao.valor ?? '';
        document.getElementById('data_movimentacao').value = movimentacao.data_movimentacao ? movimentacao.data_movimentacao.slice(0, 10) : '';
        document.getElementById('deleted').value = String(movimentacao.deleted === true);
        await carregarContasToMovimentacoes(servidorDw3); // Carrega o component Select2.
        $('#contaid').val(movimentacao.contaid).trigger('change');
        return true;
    } catch (error) {
        alert(error.message || 'Erro ao carregar movimentacao.');
        return false;
    }
}

async function vwUpdateMovimentacao() {
    var form = document.getElementById('frmMovimentacoes');
    var btnAtualizar = document.getElementById('btnAtualizarMovimentacao');
    if (btnAtualizar.disabled || !form.reportValidity()) {
        return;
    }
    try {
        var movimentacaoId = new URLSearchParams(window.location.search).get('movimentacaoId');
        var servidorDw3 = form.dataset.servidorDw3;
        if (!movimentacaoId || !/^\d+$/.test(movimentacaoId) || Number(movimentacaoId) <= 0) {
            throw new Error('ID da movimentacao invalido.');
        }
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        btnAtualizar.disabled = true;
        var movimentacao = montarMovimentacaoDoFormulario();
        movimentacao.valor = Number(movimentacao.valor);
        movimentacao.contaid = Number(movimentacao.contaid);
        var response = await fetch(servidorDw3 + '/updateMovimentacao/' + encodeURIComponent(movimentacaoId), {
            method: 'PUT',
            headers: dw3MontarHeadersAutenticacao({
                'content-type': 'application/json'
            }),
            body: JSON.stringify(movimentacao)
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel atualizar a movimentacao.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel atualizar a movimentacao.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma movimentacao foi atualizada.');
        }
        alert('Movimentacao atualizada com sucesso.');
    } catch (error) {
        alert(error.message || 'Erro ao atualizar movimentacao.');
    } finally {
        btnAtualizar.disabled = false;
    }
}

async function vwDeleteMovimentacao() {
    var form = document.getElementById('frmMovimentacoes');
    var btnRemover = document.getElementById('btnRemoverMovimentacao');
    if (btnRemover.disabled) {
        return;
    }
    if (!window.confirm('Confirma a remoção desta movimentacao?')) {
        return;
    }
    try {
        var movimentacaoId = document.getElementById('movimentacaoid').value;
        var servidorDw3 = form.dataset.servidorDw3;
        if (!movimentacaoId || !/^\d+$/.test(movimentacaoId) || Number(movimentacaoId) <= 0) {
            throw new Error('ID da movimentacao invalido.');
        }
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        btnRemover.disabled = true;
        var response = await fetch(servidorDw3 + '/deleteMovimentacao/' + encodeURIComponent(movimentacaoId), {
            method: 'DELETE',
            headers: dw3MontarHeadersAutenticacao()
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel remover a movimentacao.');
        }
        var data = await response.json();
        if (data.auth === false) {
            throw new Error(data.message || 'Sessao expirada. Faca login novamente.');
        }
        if (data.status !== 'ok') {
            throw new Error(data.status || 'Nao foi possivel remover a movimentacao.');
        }
        if (data.linhasAfetadas !== 1) {
            throw new Error('Nenhuma movimentacao foi removida.');
        }
        window.location.href = '/movimentacoes';
    } catch (error) {
        alert(error.message || 'Erro ao remover movimentacao.');
    } finally {
        btnRemover.disabled = false;
    }
}
