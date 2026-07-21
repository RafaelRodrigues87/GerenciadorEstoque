package com.estoque.app.controller;

import com.estoque.app.dto.Response.MovimentacaoResponse;
import com.estoque.app.service.MovimentacaoEstoqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimentacoes")
@RequiredArgsConstructor
public class MovimentacaoEstoqueController {

    private final MovimentacaoEstoqueService movimentacaoEstoqueService;

    @GetMapping("/listar")
    public ResponseEntity<List<MovimentacaoResponse>> listarTodas() {
        return ResponseEntity.ok(movimentacaoEstoqueService.listarTodas());
    }

    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<MovimentacaoResponse>> listarPorProduto(@PathVariable Long produtoId) {
        return ResponseEntity.ok(movimentacaoEstoqueService.listarPorProduto(produtoId));
    }
}