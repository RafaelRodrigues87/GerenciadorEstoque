package com.estoque.app.repository;

import com.estoque.app.entities.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT COALESCE(SUM(v.valorTotal), 0) FROM Venda v WHERE v.dataHora BETWEEN :inicio AND :fim")
    java.math.BigDecimal somarValorTotalEntre(LocalDateTime inicio, LocalDateTime fim);
}