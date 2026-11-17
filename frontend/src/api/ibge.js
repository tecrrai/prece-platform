// Lista de UFs estatica; municipios vem da API publica do IBGE.
export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export async function listarMunicipios(uf) {
  const res = await fetch(`https://servicos.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
  if (!res.ok) throw new Error('Falha ao carregar municípios')
  const data = await res.json()
  return data.map((m) => m.nome)
}
