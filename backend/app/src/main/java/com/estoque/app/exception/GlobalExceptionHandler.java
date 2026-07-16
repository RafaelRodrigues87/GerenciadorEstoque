package com.estoque.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // "Não encontrado" ou "categoria inválida" -> 400 (o cliente pediu algo que não existe/não é válido)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> tratarIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(corpoDeErro(ex.getMessage()));
    }

    // Regra de negócio violada (ex: estoque insuficiente, categoria com produtos vinculados) -> 409 Conflict
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> tratarIllegalState(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(corpoDeErro(ex.getMessage()));
    }

    // Erros de @Valid nos DTOs (ex: campo obrigatório vazio) -> 400 com a lista de campos inválidos
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> tratarValidacao(MethodArgumentNotValidException ex) {
        Map<String, String> erros = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(erro ->
                erros.put(erro.getField(), erro.getDefaultMessage())
        );

        Map<String, Object> corpo = corpoDeErro("Dados inválidos");
        corpo.put("campos", erros);
        return ResponseEntity.badRequest().body(corpo);
    }

    private Map<String, Object> corpoDeErro(String mensagem) {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("mensagem", mensagem);
        return corpo;
    }
}