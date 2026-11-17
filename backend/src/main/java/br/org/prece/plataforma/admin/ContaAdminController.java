package br.org.prece.plataforma.admin;

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.org.prece.plataforma.usuario.Perfil;
import br.org.prece.plataforma.usuario.Usuario;
import br.org.prece.plataforma.usuario.UsuarioRepository;
import br.org.prece.plataforma.usuario.UsuarioResponseDTO;

@RestController
@RequestMapping("/api/admin/users")
public class ContaAdminController {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijkmnopqrstuvwxyz";
    private static final String DIGITS = "23456789";
    private static final String SPECIAL = "!@#$%&*+-_?";
    private final UsuarioRepository users;
    private final PasswordEncoder encoder;

    public ContaAdminController(UsuarioRepository users, PasswordEncoder encoder) { this.users = users; this.encoder = encoder; }

    @GetMapping
    public List<UsuarioResponseDTO> list() { return users.findAll().stream().map(UsuarioResponseDTO::new).toList(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Criada create(@RequestBody NovaConta body) {
        String email = body.email() == null ? "" : body.email().trim().toLowerCase(Locale.ROOT);
        if (body.nome() == null || body.nome().isBlank() || email.isBlank() || body.perfil() == null || body.perfil() == Perfil.ADMIN)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe nome, email e perfil de aluno ou professor.");
        if (users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Este email já possui uma conta.");
        String temporary = temporaryPassword();
        Usuario user = users.save(Usuario.builder().nome(body.nome().trim()).email(email).perfil(body.perfil()).senha(encoder.encode(temporary)).primeiroAcesso(true).ativo(true).build());
        return new Criada(new UsuarioResponseDTO(user), temporary);
    }

    private static String temporaryPassword() {
        String pool = UPPER + LOWER + DIGITS + SPECIAL;
        StringBuilder out = new StringBuilder().append(pick(UPPER)).append(pick(LOWER)).append(pick(DIGITS)).append(pick(SPECIAL));
        while (out.length() < 18) out.append(pick(pool));
        char[] chars = out.toString().toCharArray();
        for (int i = chars.length - 1; i > 0; i--) { int j = RANDOM.nextInt(i + 1); char c = chars[i]; chars[i] = chars[j]; chars[j] = c; }
        return new String(chars);
    }
    private static char pick(String pool) { return pool.charAt(RANDOM.nextInt(pool.length())); }
    public record NovaConta(String nome, String email, Perfil perfil) {}
    public record Criada(UsuarioResponseDTO usuario, String senhaTemporaria) {}
}
