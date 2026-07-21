package com.estoque.app.dto.Request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record AtualizarProdutoRequest(
        @NotBlank @Size(max = 150) String nome,
        @NotNull Long categoriaId,
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal precoCusto,
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal precoVenda,
        @NotNull @Min(0) Integer quantidadeMinima
) {
}