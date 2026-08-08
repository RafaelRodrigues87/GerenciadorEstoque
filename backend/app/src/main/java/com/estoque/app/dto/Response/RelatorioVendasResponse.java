package com.estoque.app.dto.Response;


import java.math.BigDecimal;

public record RelatorioVendasResponse(
        BigDecimal totalGeral,
        long quantidadeVendas,
        BigDecimal totalDinheiro,
        BigDecimal totalPix,
        BigDecimal totalCartao
) {
}