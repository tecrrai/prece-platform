package br.org.prece.plataforma;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.org.prece.plataforma.auth.AuthResponseDTO;
import br.org.prece.plataforma.auth.AuthService;
import br.org.prece.plataforma.auth.LoginRequestDTO;
import br.org.prece.plataforma.security.JwtService;
import br.org.prece.plataforma.usuario.Perfil;
import br.org.prece.plataforma.usuario.Usuario;
import br.org.prece.plataforma.usuario.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    UsuarioRepository repository;

    PasswordEncoder encoder = new BCryptPasswordEncoder();
    JwtService jwt = new JwtService("test-secret-test-secret-test-secret-123456", 60_000);
    AuthService service;

    @BeforeEach
    void setUp() {
        service = new AuthService(repository, encoder, jwt);
    }

    @Test
    void loginComSenhaCorretaRetornaToken() {
        Usuario u = Usuario.builder().email("maria@exemplo.com").nome("Maria")
                .senha(encoder.encode("senha1234")).perfil(Perfil.PROFESSOR).build();
        when(repository.findByEmail("maria@exemplo.com")).thenReturn(Optional.of(u));

        AuthResponseDTO resp = service.login(new LoginRequestDTO("Maria@exemplo.com", "senha1234"));

        assertThat(resp.usuario().perfil()).isEqualTo(Perfil.PROFESSOR);
    }

    @Test
    void loginComSenhaErradaOuEmailInexistenteDaMesmaMensagem() {
        Usuario u = Usuario.builder().email("maria@exemplo.com")
                .senha(encoder.encode("senha1234")).perfil(Perfil.ALUNO).build();
        when(repository.findByEmail("maria@exemplo.com")).thenReturn(Optional.of(u));
        when(repository.findByEmail("outro@exemplo.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.login(new LoginRequestDTO("maria@exemplo.com", "errada")))
                .isInstanceOf(BadCredentialsException.class).hasMessage("Email ou senha inválidos");
        assertThatThrownBy(() -> service.login(new LoginRequestDTO("outro@exemplo.com", "qualquer")))
                .isInstanceOf(BadCredentialsException.class).hasMessage("Email ou senha inválidos");
    }
}
