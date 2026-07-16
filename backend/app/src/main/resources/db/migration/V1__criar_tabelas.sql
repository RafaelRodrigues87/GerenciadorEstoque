-- V1__criar_tabelas.sql
-- Estrutura inicial do EstoqueFácil

CREATE TABLE usuario (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(120)    NOT NULL,
    email           VARCHAR(150)    NOT NULL,
    senha_hash      VARCHAR(255)    NOT NULL,
    papel           VARCHAR(20)     NOT NULL,
    ativo           BOOLEAN         NOT NULL DEFAULT TRUE,
    criado_em       DATETIME        NOT NULL,
    CONSTRAINT uk_usuario_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categoria (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(80)     NOT NULL,
    descricao       VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE produto (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria_id        BIGINT          NOT NULL,
    nome                VARCHAR(150)    NOT NULL,
    codigo_barras       VARCHAR(50),
    preco_custo         DECIMAL(10,2)   NOT NULL,
    preco_venda         DECIMAL(10,2)   NOT NULL,
    quantidade_atual    INT             NOT NULL DEFAULT 0,
    quantidade_minima   INT             NOT NULL DEFAULT 0,
    ativo               BOOLEAN         NOT NULL DEFAULT TRUE,
    criado_em           DATETIME        NOT NULL,
    CONSTRAINT uk_produto_codigo_barras UNIQUE (codigo_barras),
    CONSTRAINT fk_produto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_produto_categoria ON produto (categoria_id);
CREATE INDEX idx_produto_estoque_baixo ON produto (quantidade_atual, quantidade_minima);

CREATE TABLE venda (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      BIGINT          NOT NULL,
    data_hora       DATETIME        NOT NULL,
    valor_total     DECIMAL(10,2)   NOT NULL,
    forma_pagamento VARCHAR(20)     NOT NULL,
    status          VARCHAR(20)     NOT NULL,
    CONSTRAINT fk_venda_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_venda_usuario ON venda (usuario_id);
CREATE INDEX idx_venda_data_hora ON venda (data_hora);

CREATE TABLE item_venda (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    venda_id        BIGINT          NOT NULL,
    produto_id      BIGINT          NOT NULL,
    quantidade      INT             NOT NULL,
    preco_unitario  DECIMAL(10,2)   NOT NULL,
    subtotal        DECIMAL(10,2)   NOT NULL,
    CONSTRAINT fk_item_venda_venda FOREIGN KEY (venda_id) REFERENCES venda (id),
    CONSTRAINT fk_item_venda_produto FOREIGN KEY (produto_id) REFERENCES produto (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_item_venda_venda ON item_venda (venda_id);
CREATE INDEX idx_item_venda_produto ON item_venda (produto_id);

CREATE TABLE movimentacao_estoque (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    produto_id      BIGINT          NOT NULL,
    usuario_id      BIGINT          NOT NULL,
    tipo            VARCHAR(20)     NOT NULL,
    quantidade      INT             NOT NULL,
    motivo          VARCHAR(255),
    data_hora       DATETIME        NOT NULL,
    CONSTRAINT fk_movimentacao_produto FOREIGN KEY (produto_id) REFERENCES produto (id),
    CONSTRAINT fk_movimentacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_movimentacao_produto ON movimentacao_estoque (produto_id);
CREATE INDEX idx_movimentacao_data_hora ON movimentacao_estoque (data_hora);