package com.estoque.app.dto.Response;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String papel,
        boolean ativo,
        LocalDateTime criadoEm
) {
}