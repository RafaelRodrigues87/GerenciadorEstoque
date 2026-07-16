package com.estoque.app.dto.Response;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String papel,
        boolean ativo
) {
}