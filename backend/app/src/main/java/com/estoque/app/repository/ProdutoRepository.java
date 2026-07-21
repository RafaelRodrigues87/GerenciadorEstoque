package com.estoque.app.repository;

import com.estoque.app.entities.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT p FROM Produto p WHERE p.quantidadeAtual < p.quantidadeMinima AND p.ativo = true")
    List<Produto> findComEstoqueBaixo();
}