package com.estoque.app.controller;

import com.estoque.app.dto.Request.CriarVendaRequest;
import com.estoque.app.dto.Response.ResumoVendasHojeResponse;
import com.estoque.app.dto.Response.VendaResponse;
import com.estoque.app.enums.StatusVenda;
import com.estoque.app.service.VendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vendas")
@RequiredArgsConstructor
public class VendaController {

    private final VendaService vendaService;

    @PostMapping("/criar")
    public ResponseEntity<VendaResponse> criar(
            @Valid @RequestBody CriarVendaRequest request,
            Authentication authentication
    ) {
        String emailUsuarioLogado = authentication.getName();
        VendaResponse response = vendaService.criarVenda(request, emailUsuarioLogado);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Paginado por padrão: 20 por página, mais recente primeiro.
    // O front controla isso via query params ?page=0&size=20
    // status é opcional: /vendas/listar?status=CANCELADA
    @GetMapping("/listar")
    public ResponseEntity<Page<VendaResponse>> listarTodas(
            @PageableDefault(size = 20, sort = "dataHora", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) StatusVenda status
    ) {
        return ResponseEntity.ok(vendaService.listarPaginado(pageable, status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vendaService.buscarPorId(id));
    }

    @GetMapping("/resumo-hoje")
    public ResponseEntity<ResumoVendasHojeResponse> resumoHoje() {
        return ResponseEntity.ok(vendaService.resumoHoje());
    }

    @PatchMapping("/cancelar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VendaResponse> cancelar(@PathVariable Long id, Authentication authentication) {
        String emailUsuarioLogado = authentication.getName();
        return ResponseEntity.ok(vendaService.cancelar(id, emailUsuarioLogado));
    }
}