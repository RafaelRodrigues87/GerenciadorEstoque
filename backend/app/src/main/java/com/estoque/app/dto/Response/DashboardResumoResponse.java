package com.estoque.app.dto.Response;

import java.math.BigDecimal;

public record DashboardResumoResponse(
        long itensEmEstoque,
        BigDecimal valorEmEstoque,
        BigDecimal valorDoEstoque,
        BigDecimal vendasHoje,
        long alertasEstoqueBaixo
) {
}
