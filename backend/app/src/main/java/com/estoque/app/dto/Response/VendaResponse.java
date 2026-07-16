package com.estoque.app.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record VendaResponse(
        Long id,
        String usuarioNome,
        LocalDateTime dataHora,
        BigDecimal valorTotal,
        String formaPagamento,
        String status,
        List<ItemVendaResponse> itens
) {
}