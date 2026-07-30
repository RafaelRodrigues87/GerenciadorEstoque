package com.estoque.app.repository;

import com.estoque.app.enums.StatusVenda;
import com.estoque.app.entities.Venda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);

    Page<Venda> findByStatus(StatusVenda status, Pageable pageable);

    @Query("SELECT COALESCE(SUM(v.valorTotal), 0) FROM Venda v WHERE v.dataHora BETWEEN :inicio AND :fim AND v.status = 'CONCLUIDA'")
    BigDecimal somarValorTotalEntre(LocalDateTime inicio, LocalDateTime fim);
}