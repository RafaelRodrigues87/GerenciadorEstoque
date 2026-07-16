package com.estoque.app.service;

import com.estoque.app.dto.Request.CategoriaRequest;
import com.estoque.app.dto.Response.CategoriaResponse;
import com.estoque.app.entities.Categoria;
import com.estoque.app.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaResponse criar(CategoriaRequest request) {
        Categoria categoria = Categoria.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .build();

        categoria = categoriaRepository.save(categoria);
        return paraResponse(categoria);
    }

    public List<CategoriaResponse> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarOuFalhar(id);
        categoria.setNome(request.nome());
        categoria.setDescricao(request.descricao());
        categoria = categoriaRepository.save(categoria);
        return paraResponse(categoria);
    }

    public void remover(Long id) {
        Categoria categoria = buscarOuFalhar(id);

        if (!categoria.getProdutos().isEmpty()) {
            throw new IllegalStateException(
                    "Não é possível remover: existem produtos cadastrados nesta categoria"
            );
        }

        categoriaRepository.delete(categoria);
    }

    private Categoria buscarOuFalhar(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    }

    private CategoriaResponse paraResponse(Categoria categoria) {
        return new CategoriaResponse(categoria.getId(), categoria.getNome(), categoria.getDescricao());
    }
}