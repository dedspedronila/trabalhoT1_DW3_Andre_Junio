//quando entrar na pagina valida o login, busca os elementos da listagem e inicia o carregamento das 
// movimentações
document.addEventListener('DOMContentLoaded', function() {
    if (!dw3IsLogged()) {
        return; //sai se não estiver logado
    }
    var listagem = document.getElementById('movimentacoesListagem');
    var alertBox = document.getElementById('movimentacoesAlert');
    if (!listagem) {
        return;
    }
    var servidorDw3 = listagem.dataset.servidorDw3;
    configurarOperacoesMovimentacoes(alertBox);
    carregarMovimentacoes(servidorDw3, alertBox);
});

//faz uma requisição GET para buscar todas as movimentações cadastradas no servidor
async function carregarMovimentacoes(servidorDw3, alertBox) {
    try {
        if (!servidorDw3) {
            throw new Error('Endereco do servidor backend nao configurado.');
        }
        var response = await fetch(servidorDw3 + '/getAllMovimentacoes', {
            headers: dw3MontarHeadersAutenticacao()
        });
        if (!response.ok) {
            throw new Error('Nao foi possivel carregar a lista de movimentacoes.');
        }
        var data = await response.json();
        if (data.status !== 'ok' || !Array.isArray(data.registro)) {
            throw new Error('Resposta invalida do servidor backend.');
        }

        //inicializa a tabela com os registros obtidos
        inicializarTabelaMovimentacoes(data.registro);
    } catch (error) {
        exibirErro(alertBox, error.message || 'Erro ao carregar movimentacoes.');
        inicializarTabelaMovimentacoes([]); //tabela vazia em caso de erro
    }
}
//plugin DataTable preenchendo colunas, formatação de valor, data e botões de ação
function inicializarTabelaMovimentacoes(movimentacoes) {
    new DataTable('#tblMovimentacoes', {
        data: movimentacoes,
        columns: [
            { data: 'movimentacaoid', defaultContent: '' },
            { data: 'descricao', defaultContent: '' },
            { data: 'tipo', defaultContent: '' },
            {
                data: 'valor',
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
            {
                data: 'data_movimentacao',
                defaultContent: '',
                render: function(data) {
                    if (!data) {
                        return '';
                    }
                    //formata a data para o padrão brasileiro (DD/MM/AAAA)
                    return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
                }
            },
            { data: 'nome_banco', defaultContent: '' },
            {
                data: null,
                orderable: false,
                searchable: false,
                render: function(data, type, row) {
                    if (type !== 'display') {
                        return '';
                    }
                    var movimentacaoId = escaparHtml(row.movimentacaoid || '');
                    //renderiza os botões de visualizar, atualizar e remover em cada linha
                    return [
                        '<div class="btn-group btn-group-sm" role="group" aria-label="Operacoes da movimentacao">',
                        '<button class="btn btn-outline-primary" type="button" data-action="visualizar" data-movimentacaoid="' + movimentacaoId + '" title="Visualizar" aria-label="Visualizar"><i class="bi bi-eye"></i></button>',
                        '<button class="btn btn-outline-secondary" type="button" data-action="atualizar" data-movimentacaoid="' + movimentacaoId + '" title="Atualizar" aria-label="Atualizar"><i class="bi bi-pencil-square"></i></button>',
                        '<button class="btn btn-outline-danger" type="button" data-action="remover" data-movimentacaoid="' + movimentacaoId + '" title="Remover" aria-label="Remover"><i class="bi bi-trash"></i></button>',
                        '</div>'
                    ].join('');
                }
            }
        ],
        //rraduções da interface do DataTable para o português
        language: {
            emptyTable: 'Nenhuma movimentacao cadastrada.',
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

//configura os cliques nos botões da tabela para redirecionar para o formulário com a operação
// correta
function configurarOperacoesMovimentacoes(alertBox) {
    var tabela = document.getElementById('tblMovimentacoes');
    if (!tabela) {
        return;
    }
    tabela.addEventListener('click', function(event) {
        var botao = event.target.closest('button[data-action][data-movimentacaoid]');
        if (!botao) {
            return;
        }
        var action = botao.dataset.action;
        var movimentacaoId = botao.dataset.movimentacaoid;

        //redireciona para visualização ('Re')
        if (action === 'visualizar') {
            window.location.href = '/movimentacoes/form?oper=Re&movimentacaoId=' + encodeURIComponent(movimentacaoId);
            return;
        }

        //redireciona para atualização ('Up')
        if (action === 'atualizar') {
            window.location.href = '/movimentacoes/form?oper=Up&movimentacaoId=' + encodeURIComponent(movimentacaoId);
            return;
        }

        //redireciona para remoção ('De')
        if (action === 'remover') {
            window.location.href = '/movimentacoes/form?oper=De&movimentacaoId=' + encodeURIComponent(movimentacaoId);
        }
    });
}

//exibe uma mensagem de aviso na tela
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
