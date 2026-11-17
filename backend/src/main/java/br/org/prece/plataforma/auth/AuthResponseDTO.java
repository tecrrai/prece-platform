package br.org.prece.plataforma.auth;

import br.org.prece.plataforma.usuario.UsuarioResponseDTO;

public record AuthResponseDTO(String token, UsuarioResponseDTO usuario) {
}
