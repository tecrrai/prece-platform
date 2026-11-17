package br.org.prece.plataforma.usuario;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "usuario")
@Entity(name = "usuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "id")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nome;

    private String endereco;
    private String cep;

    @Column(length = 2)
    private String uf;

    private String municipio;
    private String telefone;

    private String nascimento;
    @jakarta.persistence.Column(columnDefinition = "text")
    private String fotoPerfil;
    @Column(nullable = false, columnDefinition = "boolean default true")
    @Builder.Default
    private boolean primeiroAcesso = true;
    @Column(nullable = false, columnDefinition = "boolean default true")
    @Builder.Default
    private boolean ativo = true;

    /** Usado como login. Sempre armazenado em minusculas. */
    @Column(nullable = false, unique = true)
    private String email;

    /** Hash BCrypt, nunca a senha em texto. */
    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Perfil perfil;

    private LocalDateTime criadoEm;

    @PrePersist
    void antesDePersistir() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }
}
