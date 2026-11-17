import http from './http'

export const login = (email, senha) => http.post('/api/auth/login', { email, senha }).then((r) => r.data)

export const me = () => http.get('/api/auth/me').then((r) => r.data)
export const updateProfile = (dados) => http.put('/api/usuarios/me', dados).then((r) => r.data)
export const listUsers = () => http.get('/api/admin/users').then((r) => r.data)
export const createUser = (dados) => http.post('/api/admin/users', dados).then((r) => r.data)
