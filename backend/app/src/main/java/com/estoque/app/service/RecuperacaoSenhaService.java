package com.estoque.app.service;

import com.estoque.app.dto.Request.EsqueciSenhaRequest;
import com.estoque.app.dto.Request.RedefinirSenhaRequest;
import com.estoque.app.entities.RecuperacaoSenha;
import com.estoque.app.entities.Usuario;
import com.estoque.app.repository.RecuperacaoSenhaRepository;
import com.estoque.app.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RecuperacaoSenhaService {


    private static final int MINUTOS_VALIDADE = 15;

    private final UsuarioRepository usuarioRepository;
    private final RecuperacaoSenhaRepository codigoRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom random = new SecureRandom();

    // Sempre "sucede" do ponto de vista do cliente, exista ou não o e-mail —
    // isso evita que alguém use esse endpoint pra descobrir quais e-mails
    // estão cadastrados no sistema (enumeração de usuários)
    public void solicitarCodigo(EsqueciSenhaRequest request) {
        usuarioRepository.findByEmail(request.email()).ifPresent(usuario -> {
            String codigo = gerarCodigo();

            RecuperacaoSenha codigoRecuperacao = RecuperacaoSenha.builder()
                    .usuario(usuario)
                    .codigo(codigo)
                    .expiraEm(LocalDateTime.now().plusMinutes(MINUTOS_VALIDADE))
                    .build();

            codigoRepository.save(codigoRecuperacao);
            emailService.EnviarCodigoRecuperacao(usuario.getEmail(), usuario.getNome(), codigo);
        });
    }

    public void redefinirSenha(RedefinirSenhaRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Código inválido"));

        RecuperacaoSenha codigoRecuperacao = codigoRepository
                .findByUsuarioIdAndCodigoAndUsadoFalse(usuario.getId(), request.codigo())
                .orElseThrow(() -> new IllegalArgumentException("Código inválido"));

        if (codigoRecuperacao.isExpirado()) {
            throw new IllegalStateException("Este código expirou. Solicite um novo.");
        }

        usuario.setSenhaHash(passwordEncoder.encode(request.novaSenha()));
        usuarioRepository.save(usuario);

        codigoRecuperacao.setUsado(true);
        codigoRepository.save(codigoRecuperacao);
    }

    private String gerarCodigo() {
        int numero = 100000 + random.nextInt(900000); // sempre 6 dígitos, de 100000 a 999999
        return String.valueOf(numero);
    }
}
