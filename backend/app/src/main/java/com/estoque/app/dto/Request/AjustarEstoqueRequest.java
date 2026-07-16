package com.estoque.app.dto.Request;

import com.estoque.app.enums.TipoMovimentacao;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AjustarEstoqueRequest(
        @NotNull TipoMovimentacao tipo,
        @NotNull @Min(0) Integer quantidade,
        @Size(max = 255) String motivo
) {
}