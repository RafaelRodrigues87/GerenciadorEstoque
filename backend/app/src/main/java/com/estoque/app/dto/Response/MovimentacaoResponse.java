package com.estoque.app.dto.Response;

import java.time.LocalDateTime;

public record MovimentacaoResponse(
        Long id,
        Long produtoId,
        String produtoNome,
        String usuarioNome,
        String tipo,
        Integer quantidade,
        String motivo,
        LocalDateTime dataHora
) {
}
