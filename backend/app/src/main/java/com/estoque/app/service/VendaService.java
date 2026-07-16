package com.estoque.app.service;

import com.estoque.app.dto.Request.CriarVendaRequest;
import com.estoque.app.dto.Request.ItemVendaRequest;
import com.estoque.app.dto.Response.ItemVendaResponse;
import com.estoque.app.dto.Response.ResumoVendasHojeResponse;
import com.estoque.app.dto.Response.VendaResponse;
import com.estoque.app.entities.*;
import com.estoque.app.enums.TipoMovimentacao;
import com.estoque.app.repository.MovimentacaoEstoqueRepository;
import com.estoque.app.repository.ProdutoRepository;
import com.estoque.app.repository.UsuarioRepository;
import com.estoque.app.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
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

    // @Transactional aqui é o ponto-chave: se qualquer produto não tiver estoque
    // suficiente e a exceção for lançada no meio do loop, TUDO é desfeito —
    // nenhuma baixa parcial fica registrada, nenhuma venda "pela metade" é salva.
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

            // Baixa no estoque
            produto.setQuantidadeAtual(produto.getQuantidadeAtual() - itemRequest.quantidade());
            produtoRepository.save(produto);

            // Preço é copiado AGORA — se o preço do produto mudar amanhã,
            // esta venda continua registrada com o valor cobrado de verdade
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

            // Auditoria: toda saída de estoque por venda fica registrada aqui também
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

    public VendaResponse buscarPorId(Long id) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Venda não encontrada"));
        return paraResponse(venda);
    }

    public List<VendaResponse> listarTodas() {
        return vendaRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public ResumoVendasHojeResponse resumoHoje() {
        LocalDateTime inicioDoDia = LocalDate.now().atStartOfDay();
        LocalDateTime fimDoDia = LocalDate.now().atTime(LocalTime.MAX);

        List<Venda> vendasHoje = vendaRepository.findByDataHoraBetween(inicioDoDia, fimDoDia);
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