package com.estoque.app.service;

import com.estoque.app.dto.Response.MovimentacaoResponse;
import com.estoque.app.entities.MovimentacaoEstoque;
import com.estoque.app.repository.MovimentacaoEstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MovimentacaoEstoqueService {

    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;

    public List<MovimentacaoResponse> listarTodas() {
        return movimentacaoEstoqueRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public List<MovimentacaoResponse> listarPorProduto(Long produtoId) {
        return movimentacaoEstoqueRepository.findByProdutoIdOrderByDataHoraDesc(produtoId)
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    private MovimentacaoResponse paraResponse(MovimentacaoEstoque movimentacao) {
        return new MovimentacaoResponse(
                movimentacao.getId(),
                movimentacao.getProduto().getId(),
                movimentacao.getProduto().getNome(),
                movimentacao.getUsuario().getNome(),
                movimentacao.getTipo().name(),
                movimentacao.getQuantidade(),
                movimentacao.getMotivo(),
                movimentacao.getDataHora()
        );
    }
}