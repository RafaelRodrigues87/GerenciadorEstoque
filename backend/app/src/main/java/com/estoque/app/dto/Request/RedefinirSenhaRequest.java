package com.estoque.app.dto.Request;

import jakarta.validation.constraints.*;

public record RedefinirSenhaRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 6) String codigo,
        @NotBlank @Size(min = 6, message = "A nova senha precisa ter no mínimo 6 caracteres") String novaSenha
) {
}