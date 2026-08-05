-- IMPORTANTE: confira qual é o próximo número de versão livre na sua pasta
-- db/migration antes de usar este arquivo. Se já existir V3, renomeie este
-- arquivo para V4, e assim por diante — o número precisa ser o próximo
-- disponível na sequência, ou o Flyway recusa a migração.

CREATE TABLE recuperacao_senha (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      BIGINT          NOT NULL,
    codigo          VARCHAR(6)      NOT NULL,
    criado_em       DATETIME        NOT NULL,
    expira_em       DATETIME        NOT NULL,
    usado           BOOLEAN         NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_codigo_recuperacao
        FOREIGN KEY (usuario_id) REFERENCES usuario (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_codigo_recuperacao_usuario
ON recuperacao_senha (usuario_id);