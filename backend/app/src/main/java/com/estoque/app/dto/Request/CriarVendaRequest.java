package com.estoque.app.dto.Request;

import com.estoque.app.enums.FormaPagamento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CriarVendaRequest(
        @NotNull FormaPagamento formaPagamento,
        @NotEmpty(message = "A venda precisa ter pelo menos um item") @Valid List<ItemVendaRequest> itens
) {
}