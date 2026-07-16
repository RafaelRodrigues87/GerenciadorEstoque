package com.estoque.app.dto.Response;

public record LoginResponse(
        String token,
        String nome,
        String email,
        String papel
) {
}