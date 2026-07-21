package com.estoque.app.dto.Response;

import java.math.BigDecimal;

public record ProdutoResponse(
        Long id,
        String nome,
        Long categoriaId,
        String categoriaNome,
        BigDecimal precoCusto,
        BigDecimal precoVenda,
        Integer quantidadeAtual,
        Integer quantidadeMinima,
        boolean ativo,
        boolean estoqueBaixo
) {
}