package com.estoque.app.service;

import com.estoque.app.dto.Request.AjustarEstoqueRequest;
import com.estoque.app.dto.Request.AtualizarProdutoRequest;
import com.estoque.app.dto.Request.CriarProdutoRequest;
import com.estoque.app.dto.Response.ProdutoResponse;
import com.estoque.app.entities.Categoria;
import com.estoque.app.entities.MovimentacaoEstoque;
import com.estoque.app.entities.Produto;
import com.estoque.app.entities.Usuario;
import com.estoque.app.repository.CategoriaRepository;
import com.estoque.app.repository.MovimentacaoEstoqueRepository;
import com.estoque.app.repository.ProdutoRepository;
import com.estoque.app.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final MovimentacaoEstoqueRepository movimentacaoEstoqueRepository;
    private final UsuarioRepository usuarioRepository;

    public ProdutoResponse criar(CriarProdutoRequest request) {
        Categoria categoria = buscarCategoriaOuFalhar(request.categoriaId());

        Produto produto = Produto.builder()
                .categoria(categoria)
                .nome(request.nome())
                .codigoBarras(request.codigoBarras())
                .precoCusto(request.precoCusto())
                .precoVenda(request.precoVenda())
                .quantidadeAtual(request.quantidadeAtual())
                .quantidadeMinima(request.quantidadeMinima())
                .build();

        produto = produtoRepository.save(produto);
        return paraResponse(produto);
    }

    public List<ProdutoResponse> listarTodos() {
        return produtoRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public ProdutoResponse buscarPorId(Long id) {
        return paraResponse(buscarProdutoOuFalhar(id));
    }

    public ProdutoResponse buscarPorCodigoBarras(String codigoBarras) {
        Produto produto = produtoRepository.findByCodigoBarras(codigoBarras)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado para este código de barras"));
        return paraResponse(produto);
    }

    public List<ProdutoResponse> listarComEstoqueBaixo() {
        return produtoRepository.findComEstoqueBaixo()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public ProdutoResponse atualizar(Long id, AtualizarProdutoRequest request) {
        Produto produto = buscarProdutoOuFalhar(id);
        Categoria categoria = buscarCategoriaOuFalhar(request.categoriaId());

        produto.setNome(request.nome());
        produto.setCodigoBarras(request.codigoBarras());
        produto.setCategoria(categoria);
        produto.setPrecoCusto(request.precoCusto());
        produto.setPrecoVenda(request.precoVenda());
        produto.setQuantidadeMinima(request.quantidadeMinima());

        produto = produtoRepository.save(produto);
        return paraResponse(produto);
    }

    public void inativar(Long id) {
        Produto produto = buscarProdutoOuFalhar(id);
        produto.setAtivo(false);
        produtoRepository.save(produto);
    }

    @Transactional
    public ProdutoResponse ajustarEstoque(Long produtoId, AjustarEstoqueRequest request, String emailUsuarioLogado) {
        Produto produto = buscarProdutoOuFalhar(produtoId);
        Usuario usuario = usuarioRepository.findByEmail(emailUsuarioLogado)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));

        int quantidadeAnterior = produto.getQuantidadeAtual();

        switch (request.tipo()) {
            case ENTRADA -> produto.setQuantidadeAtual(quantidadeAnterior + request.quantidade());
            case SAIDA -> {
                if (quantidadeAnterior < request.quantidade()) {
                    throw new IllegalStateException("Estoque insuficiente para essa saída");
                }
                produto.setQuantidadeAtual(quantidadeAnterior - request.quantidade());
            }
            // AJUSTE: usado numa contagem física de inventário, onde o número informado
            // é o valor real contado na prateleira (substitui o que estava no sistema)
            case AJUSTE -> produto.setQuantidadeAtual(request.quantidade());
        }

        produtoRepository.save(produto);

        int quantidadeMovimentada = Math.abs(produto.getQuantidadeAtual() - quantidadeAnterior);

        MovimentacaoEstoque movimentacao = MovimentacaoEstoque.builder()
                .produto(produto)
                .usuario(usuario)
                .tipo(request.tipo())
                .quantidade(quantidadeMovimentada)
                .motivo(request.motivo())
                .build();

        movimentacaoEstoqueRepository.save(movimentacao);

        return paraResponse(produto);
    }

    private Produto buscarProdutoOuFalhar(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));
    }

    private Categoria buscarCategoriaOuFalhar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    }

    private ProdutoResponse paraResponse(Produto produto) {
        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getCodigoBarras(),
                produto.getCategoria().getId(),
                produto.getCategoria().getNome(),
                produto.getPrecoCusto(),
                produto.getPrecoVenda(),
                produto.getQuantidadeAtual(),
                produto.getQuantidadeMinima(),
                produto.isAtivo(),
                produto.isEstoqueBaixo()
        );
    }
}