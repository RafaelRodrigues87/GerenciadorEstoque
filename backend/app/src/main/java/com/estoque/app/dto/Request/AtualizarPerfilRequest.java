package com.estoque.app.dto.Request;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtualizarPerfilRequest(
        @NotBlank @Size(min = 2, max = 120) String nome,
        @NotBlank @Email String email
) {
}
