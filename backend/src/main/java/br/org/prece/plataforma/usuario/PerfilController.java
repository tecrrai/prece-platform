package br.org.prece.plataforma.usuario;

import java.util.regex.Pattern;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/usuarios/me")
public class PerfilController {
    private static final Pattern STRONG = Pattern.compile("^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{12,72}$");
    private final UsuarioRepository users;
    private final PasswordEncoder encoder;
    public PerfilController(UsuarioRepository users, PasswordEncoder encoder) { this.users = users; this.encoder = encoder; }

    @PutMapping
    public UsuarioResponseDTO update(@AuthenticationPrincipal Usuario current, @RequestBody AtualizacaoPerfil body) {
        if (body.nome() == null || body.nome().isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe seu nome completo.");
        if (body.fotoPerfil() != null && body.fotoPerfil().length() > 5_500_000) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "A imagem deve ter até 4 MB.");
        if (current.isPrimeiroAcesso()) {
            if (body.endereco() == null || body.endereco().isBlank() || body.cep() == null || body.municipio() == null || body.municipio().isBlank() || body.uf() == null || body.telefone() == null || body.telefone().isBlank())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Complete endereço, CEP, município, estado e telefone.");
            if (body.novaSenha() == null || !STRONG.matcher(body.novaSenha()).matches()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha precisa ter 12 caracteres, maiúscula, número e caractere especial.");
            current.setPrimeiroAcesso(false);
            current.setSenha(encoder.encode(body.novaSenha()));
        } else if (body.novaSenha() != null && !body.novaSenha().isBlank()) {
            if (body.senhaAtual() == null || !encoder.matches(body.senhaAtual(), current.getSenha())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha atual está incorreta.");
            if (!STRONG.matcher(body.novaSenha()).matches()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A senha precisa ter 12 caracteres, maiúscula, número e caractere especial.");
            current.setSenha(encoder.encode(body.novaSenha()));
        }
        current.setNome(body.nome().trim()); current.setEndereco(body.endereco()); current.setCep(body.cep()); current.setMunicipio(body.municipio()); current.setUf(body.uf()); current.setTelefone(body.telefone()); current.setNascimento(body.nascimento()); current.setFotoPerfil(body.fotoPerfil());
        return new UsuarioResponseDTO(users.save(current));
    }
    public record AtualizacaoPerfil(String nome, String endereco, String cep, String municipio, String uf, String telefone, String nascimento, String fotoPerfil, String senhaAtual, String novaSenha) {}
}
