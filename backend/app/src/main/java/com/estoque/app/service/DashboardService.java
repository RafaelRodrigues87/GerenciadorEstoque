package com.estoque.app.service;

import com.estoque.app.dto.Response.DashboardResumoResponse;
import com.estoque.app.dto.Response.VendaPorDiaResponse;
import com.estoque.app.entities.Produto;
import com.estoque.app.enums.StatusVenda;
import com.estoque.app.entities.Venda;
import com.estoque.app.repository.ProdutoRepository;
import com.estoque.app.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

        BigDecimal valorEmEstoque = produtosAtivos.stream()
                .map(p -> p.getPrecoCusto().multiply(BigDecimal.valueOf(p.getQuantidadeAtual())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long alertasEstoqueBaixo = produtoRepository.findComEstoqueBaixo().size();

        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        LocalDateTime fimDoDia = LocalDate.now().atTime(LocalTime.MAX);

        BigDecimal totalVendasHoje = vendaRepository.findByDataHoraBetween(inicioDoDia, fimDoDia)
                .stream()
                .filter(v -> v.getStatus() == StatusVenda.CONCLUIDA)
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new DashboardResumoResponse(itensEmEstoque, valorEmEstoque, totalVendasHoje, alertasEstoqueBaixo);
    }

    // Agrupa o total vendido por dia, dos últimos N dias (incluindo hoje).
    // Dias sem venda aparecem com total zero, pra o gráfico não ter "buracos".
    public List<VendaPorDiaResponse> vendasPorDia(int dias) {
        LocalDate hoje = LocalDate.now();
        LocalDate dataInicio = hoje.minusDays(dias - 1L);

        LocalDateTime inicio = dataInicio.atStartOfDay();
        LocalDateTime fim = hoje.atTime(LocalTime.MAX);

        List<Venda> vendas = vendaRepository.findByDataHoraBetween(inicio, fim)
                .stream()
                .filter(v -> v.getStatus() == StatusVenda.CONCLUIDA)
                .toList();

        Map<LocalDate, BigDecimal> totalPorDia = vendas.stream()
                .collect(Collectors.groupingBy(
                        v -> v.getDataHora().toLocalDate(),
                        Collectors.reducing(BigDecimal.ZERO, Venda::getValorTotal, BigDecimal::add)
                ));

        List<VendaPorDiaResponse> resultado = new ArrayList<>();
        for (int i = 0; i < dias; i++) {
            LocalDate data = dataInicio.plusDays(i);
            BigDecimal total = totalPorDia.getOrDefault(data, BigDecimal.ZERO);
            resultado.add(new VendaPorDiaResponse(data, total));
        }

        return resultado;
    }
}