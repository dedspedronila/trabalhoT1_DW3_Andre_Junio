//ao entrar na pagina carrega a listagem de contas bancarias
document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return; //sai se não estiver logado
    }
    var listagem = document.getElementById('contasListagem');
    var alertBox = document.getElementById('contasAlert');
    if (!listagem) {
        return;
    }
    var servidorDw3 = listagem.dataset.servidorDw3;
    configurarOperacoesContas(alertBox);
    carregarContas(servidorDw3, alertBox);
});

//requisição GET para buscar todas as contas bancarias cadastradas no servidor
async function carregarContas(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        var response = await fetch(servidorDw3 + '/getAllContasBancarias', {
            headers: dw3MontarHeadersAutenticacao()
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel carregar a lista de contas bancarias.');
        }
        var data = await response.json();
        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }

        //inicializa a tabela com os registros obtidos
        inicializarTabelaContas(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar contas bancarias.');
        inicializarTabelaContas([]); //inicializa tabela vazia em caso de erro
    }
}

//configura o plugin DataTable preenchendo as colunas, formatação de saldo e botões de ação
function inicializarTabelaContas(contas) {
    new DataTable('#tblContasBancarias', {
        data: contas,
        columns: [
            { data: 'contaid', defaultContent: '' },
            { data: 'banco', defaultContent: '' },
            { data: 'agencia', defaultContent: '' },
            { data: 'numero_conta', defaultContent: '' },
            {
                data: 'saldo',
                defaultContent: '',
                render: function(data) {
                    if (data === null || data === undefined || data === '') {
                        return '';
                    }

                    //formata o valor numérico para o padrão de moeda Real (BRL)
                    return Number(data).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });
                }
            },
            { data: 'ativo', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }
                    var contaId = escaparHtml(row.contaid || '');
                    //renderiza os botões de visualizar, atualizar e remover em cada linha da tabela
                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes da conta bancaria">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-contaid="' + contaId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-contaid="' + contaId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-contaid="' + contaId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],

        //traduções da interface do DataTable para o português
        language: {
            emptyTable: 'Nenhuma conta bancaria cadastrada.',
            info: 'Mostrando _START_ ate _END_ de _TOTAL_ registros',
            infoEmpty: 'Mostrando 0 ate 0 de 0 registros',
            infoFiltered: '(filtrado de _MAX_ registros no total)',
            lengthMenu: 'Mostrar _MENU_ registros',
            loadingRecords: 'Carregando...',
            processing: 'Processando...',
            search: 'Pesquisar:',
            zeroRecords: 'Nenhum registro encontrado',
            paginate: {
                first: 'Primeiro',
                last: 'Ultimo',
                next: 'Proximo',
                previous: 'Anterior'
            }
        }
    });
}

//configura os cliques nos botões da tabela para redirecionar para o formulário com a operação correta
function configurarOperacoesContas(alertBox) {
    var tabela = document.getElementById('tblContasBancarias');
    if (!tabela) {
        return;
    }
    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-contaid]');
        if (!botao) {
            return;
        }
        var action = botao.dataset.action;
        var contaId = botao.dataset.contaid;

        //redireciona para visualização ('Re')
        if (action === 'visualizar') {
            window.location.href = '/contas_bancarias/form?oper=Re&contaId=' + encodeURIComponent(contaId);
            return;
        }

        //redireciona para atualização ('Up')
        if (action === 'atualizar') {
            window.location.href = '/contas_bancarias/form?oper=Up&contaId=' + encodeURIComponent(contaId);
            return;
        }

        //redireciona para remoção ('De')
        if (action === 'remover') {
            window.location.href = '/contas_bancarias/form?oper=De&contaId=' + encodeURIComponent(contaId);
        }
    });
}

//exibe uma mensagem de aviso/informação na tela
function exibirAviso(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }
    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-danger');
    alertBox.classList.add('alert-info');
    alertBox.classList.remove('d-none');
}

//escapa caracteres especiais do HTML para evitar falhas de segurança
function escaparHtml(valor) {
    return String(valor)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

//exibe uma mensagem de erro na tela
function exibirErro(alertBox, mensagem) {
    if (!alertBox) {
        return;
    }
    alertBox.textContent = mensagem;
    alertBox.classList.remove('alert-info');
    alertBox.classList.add('alert-danger');
    alertBox.classList.remove('d-none');
}
