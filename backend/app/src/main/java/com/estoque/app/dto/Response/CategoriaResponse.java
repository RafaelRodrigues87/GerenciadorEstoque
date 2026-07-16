package com.estoque.app.dto.Response;

public record CategoriaResponse(
        Long id,
        String nome,
        String descricao
) {
}