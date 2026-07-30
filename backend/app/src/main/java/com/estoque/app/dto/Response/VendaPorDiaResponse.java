package com.estoque.app.dto.Response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record VendaPorDiaResponse(
        LocalDate data,
        BigDecimal total
) {
}