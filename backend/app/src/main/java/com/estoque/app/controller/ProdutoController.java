package com.estoque.app.controller;

import com.estoque.app.dto.Request.AjustarEstoqueRequest;
import com.estoque.app.dto.Request.AtualizarProdutoRequest;
import com.estoque.app.dto.Request.CriarProdutoRequest;
import com.estoque.app.dto.Response.ProdutoResponse;
import com.estoque.app.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping("/criar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoResponse> criar(@Valid @RequestBody CriarProdutoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.criar(request));
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ProdutoResponse>> listarTodos() {
        return ResponseEntity.ok(produtoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @GetMapping("/codigo/{codigoBarras}")
    public ResponseEntity<ProdutoResponse> buscarPorCodigoBarras(@PathVariable String codigoBarras) {
        return ResponseEntity.ok(produtoService.buscarPorCodigoBarras(codigoBarras));
    }

    @GetMapping("/estoque-baixo")
    public ResponseEntity<List<ProdutoResponse>> listarComEstoqueBaixo() {
        return ResponseEntity.ok(produtoService.listarComEstoqueBaixo());
    }

    @PutMapping("/atualizar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarProdutoRequest request
    ) {
        return ResponseEntity.ok(produtoService.atualizar(id, request));
    }

    @PatchMapping("/ajustar-estoque/{id}")
    public ResponseEntity<ProdutoResponse> ajustarEstoque(
            @PathVariable Long id,
            @Valid @RequestBody AjustarEstoqueRequest request,
            Authentication authentication
    ) {
        String emailUsuarioLogado = authentication.getName();
        return ResponseEntity.ok(produtoService.ajustarEstoque(id, request, emailUsuarioLogado));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        produtoService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}