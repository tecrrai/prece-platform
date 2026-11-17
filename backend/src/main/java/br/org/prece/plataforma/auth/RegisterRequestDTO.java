package br.org.prece.plataforma.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Cadastro publico. "atuacao" so aceita ALUNO ou PROFESSOR:
 * contas ADMIN nunca sao criadas por este endpoint.
 */
public record RegisterRequestDTO(
        @NotBlank @Pattern(regexp = "ALUNO|PROFESSOR", message = "Atuação inválida") String atuacao,
        @NotBlank @Size(max = 150) String nome,
        @NotBlank @Size(max = 200) String endereco,
        @NotBlank @Pattern(regexp = "\\d{8}", message = "CEP deve ter 8 dígitos") String cep,
        @NotBlank @Pattern(regexp = "[A-Za-z]{2}", message = "UF inválida") String uf,
        @NotBlank @Size(max = 100) String municipio,
        @NotBlank @Pattern(regexp = "\\d{10,11}", message = "Telefone deve ter 10 ou 11 dígitos") String telefone,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres") String senha) {
}
