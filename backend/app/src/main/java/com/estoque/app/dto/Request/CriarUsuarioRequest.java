package com.estoque.app.dto.Request;

import com.estoque.app.enums.Papel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CriarUsuarioRequest(
        @NotBlank @Size(min = 2, max = 120) String nome,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, message = "A senha precisa ter no mínimo 6 caracteres") String senha,
        @NotNull Papel papel
) {
}