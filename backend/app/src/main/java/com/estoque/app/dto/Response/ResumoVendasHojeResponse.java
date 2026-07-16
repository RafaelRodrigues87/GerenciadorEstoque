package com.estoque.app.dto.Response;

import java.math.BigDecimal;

public record ResumoVendasHojeResponse(
        BigDecimal totalVendidoHoje,
        long quantidadeVendasHoje
) {
}