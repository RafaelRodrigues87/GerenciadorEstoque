package com.estoque.app.service;

import com.estoque.app.dto.Response.*;
import com.estoque.app.dto.Request.*;
import com.estoque.app.entities.*;
import com.estoque.app.enums.StatusVenda;
import com.estoque.app.enums.TipoMovimentacao;
import com.estoque.app.repository.MovimentacaoEstoqueRepository;
import com.estoque.app.repository.ProdutoRepository;
import com.estoque.app.repository.UsuarioRepository;
import com.estoque.app.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public VendaResponse criarVenda(CriarVendaRequest request, String emailUsuarioLogado) {
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));

        Venda venda = Venda.builder()
                .usuario(usuario)
                .formaPagamento(request.formaPagamento())
                .valorTotal(BigDecimal.ZERO)
                .build();

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemVendaRequest itemRequest : request.itens()) {
            Produto produto = produtoRepository.findById(itemRequest.produtoId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Produto não encontrado: id " + itemRequest.produtoId()
                    ));

            if (!produto.isAtivo()) {
                throw new IllegalStateException("Produto inativo: " + produto.getNome());
            }

            if (produto.getQuantidadeAtual() < itemRequest.quantidade()) {
                throw new IllegalStateException(
                        "Estoque insuficiente para \"" + produto.getNome() + "\". Disponível: "
                                + produto.getQuantidadeAtual() + ", solicitado: " + itemRequest.quantidade()
                );
            }

            produto.setQuantidadeAtual(produto.getQuantidadeAtual() - itemRequest.quantidade());
            produtoRepository.save(produto);

            BigDecimal precoUnitario = produto.getPrecoVenda();
            BigDecimal subtotal = precoUnitario.multiply(BigDecimal.valueOf(itemRequest.quantidade()));

            ItemVenda itemVenda = ItemVenda.builder()
                    .produto(produto)
                    .quantidade(itemRequest.quantidade())
                    .precoUnitario(precoUnitario)
                    .subtotal(subtotal)
                    .build();

            venda.adicionarItem(itemVenda);
            valorTotal = valorTotal.add(subtotal);

            MovimentacaoEstoque movimentacao = MovimentacaoEstoque.builder()
                    .produto(produto)
                    .usuario(usuario)
                    .tipo(TipoMovimentacao.SAIDA)
                    .quantidade(itemRequest.quantidade())
                    .motivo("Venda")
                    .build();
            movimentacaoEstoqueRepository.save(movimentacao);
        }

        venda.setValorTotal(valorTotal);
        venda = vendaRepository.save(venda);

        return paraResponse(venda);
    }

    // Desfaz uma venda sem apagar o registro: marca como CANCELADA e devolve
    // o estoque de cada item, gerando movimentação de ENTRADA para auditoria.
    @Transactional
    public VendaResponse cancelar(Long vendaId, String emailUsuarioLogado) {
        Venda venda = vendaRepository.findById(vendaId)
                .orElseThrow(() -> new IllegalArgumentException("Venda não encontrada"));

        if (venda.getStatus() == StatusVenda.CANCELADA) {
            throw new IllegalStateException("Esta venda já está cancelada");
        }

        Usuario usuarioQueCancela = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));

        for (ItemVenda item : venda.getItens()) {
            Produto produto = item.getProduto();
            produto.setQuantidadeAtual(produto.getQuantidadeAtual() + item.getQuantidade());
            produtoRepository.save(produto);

            MovimentacaoEstoque movimentacao = MovimentacaoEstoque.builder()
                    .produto(produto)
                    .usuario(usuarioQueCancela)
                    .tipo(TipoMovimentacao.ENTRADA)
                    .quantidade(item.getQuantidade())
                    .motivo("Cancelamento da venda #" + venda.getId())
                    .build();
            movimentacaoEstoqueRepository.save(movimentacao);
        }

        venda.setStatus(StatusVenda.CANCELADA);
        venda = vendaRepository.save(venda);

        return paraResponse(venda);
    }

    public VendaResponse buscarPorId(Long id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Venda não encontrada"));
        return paraResponse(venda);
    }

    // Paginado: o front nunca carrega tudo de uma vez, só a "página" pedida.
    // status é opcional — null retorna todas, informado filtra por CONCLUIDA/CANCELADA.
    public Page<VendaResponse> listarPaginado(Pageable pageable, StatusVenda status) {
        Page<Venda> pagina = (status != null)
                ? vendaRepository.findByStatus(status, pageable)
                : vendaRepository.findAll(pageable);

        return pagina.map(this::paraResponse);
    }

    public ResumoVendasHojeResponse resumoHoje() {
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        LocalDateTime fimDoDia = LocalDate.now().atTime(LocalTime.MAX);

        List<Venda> vendasHoje = vendaRepository.findByDataHoraBetween(inicioDoDia, fimDoDia)
                .stream()
                .filter(v -> v.getStatus() == StatusVenda.CONCLUIDA)
                .toList();

        BigDecimal total = vendasHoje.stream()
                .map(Venda::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ResumoVendasHojeResponse(total, vendasHoje.size());
    }

    private VendaResponse paraResponse(Venda venda) {
        List<ItemVendaResponse> itens = venda.getItens().stream()
                .map(item -> new ItemVendaResponse(
                        item.getProduto().getId(),
                        item.getProduto().getNome(),
                        item.getQuantidade(),
                        item.getPrecoUnitario(),
                        item.getSubtotal()
                ))
                .toList();

        return new VendaResponse(
                venda.getId(),
                venda.getUsuario().getNome(),
                venda.getDataHora(),
                venda.getValorTotal(),
                venda.getFormaPagamento().name(),
                venda.getStatus().name(),
                itens
        );
    }
}