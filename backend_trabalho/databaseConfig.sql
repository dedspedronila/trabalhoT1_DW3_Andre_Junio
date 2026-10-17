CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
    usuarioid bigserial CONSTRAINT pk_usuarios PRIMARY KEY,
    username varchar(10) UNIQUE,
    password text,
    deleted boolean DEFAULT false
);

INSERT INTO usuarios VALUES
    (default, 'admin', crypt('admin', gen_salt('bf'))),
    (default, 'qwe', crypt('qwe', gen_salt('bf')))
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS contas_bancarias (
    contaid bigserial CONSTRAINT pk_contas_bancarias PRIMARY KEY,
    banco varchar(50),
    agencia varchar(10),
    numero_conta varchar(20) UNIQUE,
    saldo numeric(12,2) DEFAULT 0.00,
    ativo boolean DEFAULT true,
    deleted boolean DEFAULT false
);

INSERT INTO contas_bancarias VALUES
    (default, 'Banco do Brasil', '1234', '102030-1', 15000.50, true, false),
    (default, 'Nubank', '0001', '405060-2', 3250.00, true, false),
    (default, 'Caixa Econômica', '5678', '708090-3', 850.75, true, false)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS movimentacoes (
    movimentacaoid bigserial CONSTRAINT pk_movimentacoes PRIMARY KEY,
    descricao varchar(80),
    tipo varchar(10),
    valor numeric(10,2),
    data_movimentacao date,
    contaid bigint CONSTRAINT fk_movimentacao_conta REFERENCES contas_bancarias, 
    deleted boolean DEFAULT false
);

INSERT INTO movimentacoes VALUES
    (default, 'Recebimento de Cliente A', 'CREDITO', 2500.00, '2026-03-10',
        (SELECT contaid FROM contas_bancarias WHERE numero_conta = '102030-1'), false),
    (default, 'Pagamento Conta de Luz', 'DEBITO', 320.45, '2026-03-15',
        (SELECT contaid FROM contas_bancarias WHERE numero_conta = '102030-1'), false),
    (default, 'Transferência Recebida', 'CREDITO', 1200.00, '2026-03-20',
        (SELECT contaid FROM contas_bancarias WHERE numero_conta = '405060-2'), false)
ON CONFLICT DO NOTHING;
