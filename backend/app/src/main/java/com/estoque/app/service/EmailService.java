package com.estoque.app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String remetente;

    public void EnviarCodigoRecuperacao(String destinatario, String nomeUsuario, String codigo){
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setFrom(remetente);
        mensagem.setTo(destinatario);
        mensagem.setSubject("Codigo para Redefinir sua Senha - EstoqueFacil");
        mensagem.setText(  "Olá, " + nomeUsuario + "!\n\n" +
                "Recebemos uma solicitação para redefinir sua senha no EstoqueFácil.\n\n" +
                "Seu código de verificação é: " + codigo + "\n\n" +
                "Esse código expira em 15 minutos. Se você não pediu essa redefinição, " +
                "pode ignorar este e-mail com segurança — sua senha continua a mesma.\n\n" +
                "EstoqueFácil");
        mailSender.send(mensagem);
    }

}
