-- V2__inserir_admin_inicial.sql
-- Usuário administrador inicial. Login: admin@loja.com / Senha: admin123
-- IMPORTANTE: troque essa senha assim que possível (crie um novo admin e inative este,
-- ou implemente um endpoint de troca de senha).

INSERT INTO usuario (nome, email, senha_hash, papel, ativo, criado_em)
VALUES ('Administrador', 'admin@loja.com', '$2b$10$Wz7Si/YXcm4nqWSn9E5cSeTAmJ4f0uwWZPw3vmbJTfDn6hrdrGnN.', 'ADMIN', true, NOW());