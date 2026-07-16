package com.estoque.app.controller;

import com.estoque.app.dto.Request.CriarVendaRequest;
import com.estoque.app.dto.Response.ResumoVendasHojeResponse;
import com.estoque.app.dto.Response.VendaResponse;
import com.estoque.app.service.VendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/listar")
    public ResponseEntity<List<VendaResponse>> listarTodas() {
        return ResponseEntity.ok(vendaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(vendaService.buscarPorId(id));
    }

    @GetMapping("/resumo-hoje")
    public ResponseEntity<ResumoVendasHojeResponse> resumoHoje() {
        return ResponseEntity.ok(vendaService.resumoHoje());
    }
}