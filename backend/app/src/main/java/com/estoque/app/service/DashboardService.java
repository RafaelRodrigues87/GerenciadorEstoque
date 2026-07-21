package com.estoque.app.service;

import com.estoque.app.dto.Response.DashboardResumoResponse;
import com.estoque.app.entities.Produto;
import com.estoque.app.entities.Venda;
import com.estoque.app.repository.ProdutoRepository;
import com.estoque.app.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProdutoRepository produtoRepository;
    private final VendaRepository vendaRepository;

    public DashboardResumoResponse resumo() {
        List<Produto> produtosAtivos = produtoRepository.findAll()
                .stream()
                .filter(Produto::isAtivo)
                .toList();

        long itensEmEstoque = produtosAtivos.stream()
                .mapToLong(Produto::getQuantidadeAtual)
                .sum();

        // Valor do estoque calculado pelo preço de CUSTO — representa o capital
        // investido parado em mercadoria, que é o número mais útil pro dono decidir compras
        BigDecimal valorEmEstoque = produtosAtivos.stream()
                .map(p -> p.getPrecoCusto().multiply(BigDecimal.valueOf(p.getQuantidadeAtual())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long alertasEstoqueBaixo = produtoRepository.findComEstoqueBaixo().size();

        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        LocalDateTime fimDoDia = LocalDate.now().atTime(LocalTime.MAX);
        List<Venda> vendasHoje = vendaRepository.findByDataHoraBetween(inicioDoDia, fimDoDia);
        BigDecimal totalVendasHoje = vendasHoje.stream()
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardResumoResponse(itensEmEstoque, valorEmEstoque, totalVendasHoje, alertasEstoqueBaixo);
    }
}