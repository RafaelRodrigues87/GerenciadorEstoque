package com.estoque.app.controller;

import com.estoque.app.dto.Response.DashboardResumoResponse;
import com.estoque.app.dto.Response.VendaPorDiaResponse;
import com.estoque.app.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumoResponse> resumo() {
        return ResponseEntity.ok(dashboardService.resumo());
    }

    @GetMapping("/vendas-por-dia")
    public ResponseEntity<List<VendaPorDiaResponse>> vendasPorDia(
            @RequestParam(defaultValue = "7") int dias
    ) {
        return ResponseEntity.ok(dashboardService.vendasPorDia(dias));
    }
}