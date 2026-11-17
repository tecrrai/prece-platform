package br.org.prece.plataforma.usuario;

public record UsuarioResponseDTO(String id, String nome, String email, Perfil perfil, String endereco, String cep, String municipio, String uf, String telefone, String nascimento, String fotoPerfil, boolean primeiroAcesso, boolean ativo) {

    public UsuarioResponseDTO(Usuario u) {
        this(u.getId(), u.getNome(), u.getEmail(), u.getPerfil(), u.getEndereco(), u.getCep(), u.getMunicipio(), u.getUf(), u.getTelefone(), u.getNascimento(), u.getFotoPerfil(), u.isPrimeiroAcesso(), u.isAtivo());
    }
}
