export function perfilLabel(perfil) {
  return ({ ALUNO: 'Estudante', PROFESSOR: 'Professor', ADMIN: 'Administrador' })[perfil] ?? 'Comunidade escolar'
}

export function inicioDoPerfil(perfil) {
  return perfil === 'ADMIN' || perfil === 'PROFESSOR' ? '/app' : '/app'
}
