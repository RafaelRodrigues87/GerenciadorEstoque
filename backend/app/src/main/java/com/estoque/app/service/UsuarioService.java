package com.estoque.app.service;

import com.estoque.app.dto.Request.*;
import com.estoque.app.dto.Request.AtualizarUsuarioRequest;
import com.estoque.app.dto.Request.CriarUsuarioRequest;
import com.estoque.app.dto.Response.UsuarioResponse;
import com.estoque.app.entities.Usuario;
import com.estoque.app.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponse criar(CriarUsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Já existe um usuário com este e-mail");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .papel(request.papel())
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);
        return paraResponse(usuario);
    }

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::paraResponse)
                .toList();
    }

    public UsuarioResponse buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));
        return paraResponse(usuario);
    }

    // ADMIN editando qualquer usuário: pode mudar nome, e-mail e papel
    public UsuarioResponse atualizar(Long id, AtualizarUsuarioRequest request) {
        Usuario usuario = buscarOuFalhar(id);

        if (usuarioRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new IllegalArgumentException("Já existe outro usuário com este e-mail");
        }

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setPapel(request.papel());

        usuario = usuarioRepository.save(usuario);
        return paraResponse(usuario);
    }

    // O próprio usuário editando os dados dele: só nome e e-mail, nunca o papel
    public UsuarioResponse atualizarMeuPerfil(String emailAtual, AtualizarPerfilRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(emailAtual)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));

        if (usuarioRepository.existsByEmailAndIdNot(request.email(), usuario.getId())) {
            throw new IllegalArgumentException("Já existe outro usuário com este e-mail");
        }

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());

        usuario = usuarioRepository.save(usuario);
        return paraResponse(usuario);
    }

    // Exige a senha atual como confirmação — evita que alguém troque a senha
    // de uma sessão esquecida logada em outro computador
    public void alterarSenha(String email, AlterarSenhaRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("Usuário logado não encontrado"));

        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenhaHash())) {
            throw new IllegalArgumentException("Senha atual incorreta");
        }

        usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);
    }

    public void inativar(Long id) {
        Usuario usuario = buscarOuFalhar(id);
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    public void reativar(Long id) {
        Usuario usuario = buscarOuFalhar(id);
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
    }

    private Usuario buscarOuFalhar(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
    }

    private UsuarioResponse paraResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPapel().name(),
                usuario.isAtivo()
        );
    }
}