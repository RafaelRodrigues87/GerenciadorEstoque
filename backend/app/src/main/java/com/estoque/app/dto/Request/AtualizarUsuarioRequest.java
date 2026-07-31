package com.estoque.app.dto.Request;

import com.estoque.app.enums.Papel;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AtualizarUsuarioRequest(
        @NotBlank @Size(min = 2, max = 120) String nome,
        @NotBlank @Email String email,
        @NotNull Papel papel
) {
}
