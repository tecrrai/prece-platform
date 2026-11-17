package br.org.prece.plataforma.auth;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.org.prece.plataforma.usuario.Usuario;
import br.org.prece.plataforma.usuario.UsuarioResponseDTO;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return service.login(dto);
    }

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public UsuarioResponseDTO me(@AuthenticationPrincipal Usuario usuario) {
        return new UsuarioResponseDTO(usuario);
    }
}
