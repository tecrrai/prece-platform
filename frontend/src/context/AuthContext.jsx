import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '@/api/auth'
import { TOKEN_KEY, UNAUTHORIZED_EVENT, USER_KEY } from '@/api/http'

const AuthContext = createContext(null)

function lerUsuarioSalvo() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw && localStorage.getItem(TOKEN_KEY) ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(lerUsuarioSalvo)

  const salvarSessao = useCallback(({ token, usuario }) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(usuario))
    setUser(usuario)
    return usuario
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const login = useCallback((email, senha) => authApi.login(email, senha).then(salvarSessao), [salvarSessao])
  const updateProfile = useCallback((dados) => authApi.updateProfile(dados).then((usuario) => {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario)); setUser(usuario); return usuario
  }), [])

  // Valida o token salvo ao abrir a aplicacao
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    authApi.me().then(
      (usuario) => {
        localStorage.setItem(USER_KEY, JSON.stringify(usuario))
        setUser(usuario)
      },
      () => {}, // 401 e tratado pelo evento abaixo; falha de rede mantem a sessao
    )
  }, [])

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, updateProfile, logout }),
    [user, login, updateProfile, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
