import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as authApi from '@/api/auth'
import { AuthProvider } from '@/context/AuthContext'
import LoginPage from './LoginPage'

vi.mock('@/api/auth', () => ({ login: vi.fn(), register: vi.fn(), me: vi.fn() }))

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<p>HOME</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('LoginPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('exige email e senha', async () => {
    renderLogin()
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('Informe seu email')).toBeInTheDocument()
    expect(screen.getByText('Informe sua senha')).toBeInTheDocument()
    expect(authApi.login).not.toHaveBeenCalled()
  })

  it('entra, guarda o token e vai para a home', async () => {
    authApi.login.mockResolvedValue({
      token: 'jwt-123',
      usuario: { id: '1', nome: 'Maria Silva', email: 'maria@exemplo.com', perfil: 'ALUNO' },
    })
    renderLogin()

    await userEvent.type(screen.getByLabelText('Email'), 'maria@exemplo.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'senha1234')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('HOME')).toBeInTheDocument()
    expect(authApi.login).toHaveBeenCalledWith('maria@exemplo.com', 'senha1234')
    expect(localStorage.getItem('prece.token')).toBe('jwt-123')
  })

  it('mostra erro quando as credenciais sao invalidas', async () => {
    authApi.login.mockRejectedValue({ response: { status: 401, data: { message: 'Email ou senha inválidos' } } })
    renderLogin()

    await userEvent.type(screen.getByLabelText('Email'), 'maria@exemplo.com')
    await userEvent.type(screen.getByLabelText('Senha'), 'errada123')
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha inválidos')
    await waitFor(() => expect(localStorage.getItem('prece.token')).toBeNull())
  })

  it('alterna a visibilidade da senha', async () => {
    renderLogin()
    const senha = screen.getByLabelText('Senha')
    expect(senha).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect(senha).toHaveAttribute('type', 'text')
  })
})
