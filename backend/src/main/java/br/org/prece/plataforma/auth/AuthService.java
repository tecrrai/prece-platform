package br.org.prece.plataforma.auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.org.prece.plataforma.security.JwtService;
import br.org.prece.plataforma.usuario.Perfil;
import br.org.prece.plataforma.usuario.Usuario;
import br.org.prece.plataforma.usuario.UsuarioRepository;
import br.org.prece.plataforma.usuario.UsuarioResponseDTO;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        // Mesma mensagem para e-mail inexistente e senha errada, para nao revelar quais e-mails existem
        Usuario usuario = usuarioRepository.findByEmail(normalizar(dto.email()))
                .orElseThrow(() -> new BadCredentialsException("Email ou senha inválidos"));

        if (!usuario.isAtivo() || !passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
            throw new BadCredentialsException("Email ou senha inválidos");
        }

        return resposta(usuario);
    }

    private AuthResponseDTO resposta(Usuario usuario) {
        return new AuthResponseDTO(jwtService.gerarToken(usuario), new UsuarioResponseDTO(usuario));
    }

    private static String normalizar(String email) {
        return email.trim().toLowerCase();
    }
}
