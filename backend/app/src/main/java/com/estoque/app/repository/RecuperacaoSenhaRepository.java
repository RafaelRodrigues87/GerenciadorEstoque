package com.estoque.app.repository;

import com.estoque.app.entities.RecuperacaoSenha;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecuperacaoSenhaRepository extends JpaRepository<RecuperacaoSenha, Long> {

    Optional<RecuperacaoSenha> findByUsuarioIdAndCodigoAndUsadoFalse(Long usuarioId, String codigo);
}