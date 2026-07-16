package com.estoque.app.controller;

import com.estoque.app.dto.Request.LoginRequest;
import com.estoque.app.dto.Response.LoginResponse;
import com.estoque.app.entities.Usuario;
import com.estoque.app.repository.UsuarioRepository;
import com.estoque.app.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Usuário não encontrado após autenticação"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(usuario.getEmail())
                .password(usuario.getSenhaHash())
                .authorities("ROLE_" + usuario.getPapel().name())
                .build();

        String token = jwtService.gerarToken(userDetails);

        LoginResponse response = new LoginResponse(
                token,
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPapel().name()
        );

        return ResponseEntity.ok(response);
    }
}