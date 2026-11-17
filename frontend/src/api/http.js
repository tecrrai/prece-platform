import axios from 'axios'

export const TOKEN_KEY = 'prece.token'
export const USER_KEY = 'prece.user'
export const UNAUTHORIZED_EVENT = 'prece:unauthorized'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
})

// Envia automaticamente o JWT em toda chamada
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Token expirado/invalido numa rota protegida: avisa o AuthContext para encerrar a sessao
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url ?? ''
    const isAuthForm = url.includes('/auth/login') || url.includes('/auth/register')
    if (error.response?.status === 401 && !isAuthForm && localStorage.getItem(TOKEN_KEY)) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    return Promise.reject(error)
  },
)

/** Extrai uma mensagem amigavel de um erro do Axios. */
export function mensagemDeErro(error, padrao = 'Algo deu errado. Tente novamente.') {
  return error?.response?.data?.message ?? padrao
}

export default http
