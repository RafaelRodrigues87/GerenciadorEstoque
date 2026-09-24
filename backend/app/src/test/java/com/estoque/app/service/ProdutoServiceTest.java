package com.estoque.app.service;

import com.estoque.app.dto.Request.CriarProdutoRequest;
import com.estoque.app.dto.Response.ProdutoResponse;
import com.estoque.app.entities.Categoria;
import com.estoque.app.entities.Produto;
import com.estoque.app.repository.CategoriaRepository;
import com.estoque.app.repository.ProdutoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProdutoServiceTest {
    @Mock
    private ProdutoRepository produtoRepository;

    @Mock
    private CategoriaRepository categoriaRepository;


    @InjectMocks
    private CategoriaService categoriaService;
    @InjectMocks
    private ProdutoService produtoService;

    @Test
    void deveBuscarProdutoPorId(){

        //arrange(prepara tudo)
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Capinha iphone");

        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("Capinhas");

        produto.setCategoria(categoria);

        when(produtoRepository.findById(1L))
                .thenReturn(Optional.of(produto));

        //act(excuta aquilo que queremos testar)
        ProdutoResponse resultado = produtoService.buscarPorId(1L);

        //Assert(verifica se o resultado esta correto)
        assertEquals(1L, resultado.id());

    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoExistir(){
        //arrange
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Capinha iphone");

        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("Capinhas");

        produto.setCategoria(categoria);

        when(produtoRepository.findById(1L))
                .thenReturn(Optional.empty());


        //Assert
       IllegalArgumentException exception = assertThrows(
               IllegalArgumentException.class,
               ()-> produtoService.buscarPorId(1L)
       );
       assertEquals("Produto não encontrado", exception.getMessage());

       verify(produtoRepository).findById(1L);
    }

    @Test
    @DisplayName("deve retorna a lista de produtos")
    void deveRetornaListaProduto(){
        Produto produto1 = new Produto();
        produto1.setId(1L);
        produto1.setNome("cabo");

        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("acessorios");
        produto1.setCategoria(categoria);

        Produto produto2 = new Produto();
        produto2.setId(2L);
        produto2.setNome("pelicula");
        produto2.setCategoria(categoria);

        List<Produto> produtos = List.of(produto1, produto2);

        when(produtoRepository.findAll())
                .thenReturn(produtos);

        List<ProdutoResponse> resultados = produtoService.listarTodos();

        assertEquals(2, resultados.size());

        verify(produtoRepository).findAll();

    }
    @Test
    @DisplayName("deve retornar lista vazia quando nao houver produtos")
    void deveRetornarListaVazia(){
        //assinalando que a lista e vazia
        when(produtoRepository.findAll())
                .thenReturn(List.of());

        List<ProdutoResponse> resultados = produtoService.listarTodos();

        assertEquals(0, resultados.size());

        verify(produtoRepository).findAll();



    }

    @Test
    @DisplayName("deve criar um produto")
    void deveCriarUmProduto(){
        Categoria categoria = new Categoria();
        categoria.setId(1L);
        categoria.setNome("pelicula");

        when(categoriaRepository.findById(1L))
                .thenReturn(Optional.of(categoria));

        CriarProdutoRequest request = new CriarProdutoRequest(
                "Cabo USb",
                1L,
                new BigDecimal("10.00"),
                new BigDecimal("20.00"),
                10,
                2

        );

        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("CABO USB");
        produto.setCategoria(categoria);
        produto.setPrecoCusto(new BigDecimal("10.00"));
        produto.setPrecoVenda(new BigDecimal("20.00"));
        produto.setQuantidadeAtual(10);
        produto.setQuantidadeMinima(2);


        when(produtoRepository.save(any(Produto.class)))
                .thenReturn(produto);

        ProdutoResponse resultado = produtoService.criar(request);

        assertEquals(1l, resultado.id());
        assertEquals("CABO USB", resultado.nome());

        verify(produtoRepository).save(any(Produto.class));
    }
}