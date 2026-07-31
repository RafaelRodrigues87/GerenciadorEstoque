package com.estoque.app.dto.Request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarSenhaRequest(
        @NotBlank String senhaAtual,
        @NotBlank @Size(min = 6, message = "A nova senha precisa ter no mínimo 6 caracteres") String novaSenha
) {
}