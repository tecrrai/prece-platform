import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminPage from '@/pages/AdminPage'
import DashboardPage from '@/pages/DashboardPage'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import PlaceholderPage from '@/pages/PlaceholderPage'
import PasswordRecoveryPage from '@/pages/PasswordRecoveryPage'
import FirstAccessPage from '@/pages/FirstAccessPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import UnderConstructionPage from '@/pages/UnderConstructionPage'

function ComPermissao({ perfis, children }) {
  return <ProtectedRoute roles={perfis}>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/contato" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<Navigate to="/login" replace />} />
      <Route path="/recuperar-senha" element={<PasswordRecoveryPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/primeiro-acesso" element={<FirstAccessPage />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="pessoas" element={<ComPermissao perfis={['ADMIN']}><AdminPage /></ComPermissao>} />
          <Route path="perfil" element={<UnderConstructionPage />} />
          <Route path="*" element={<UnderConstructionPage />} />
        </Route>
      </Route>

      <Route path="/tarefas" element={<Navigate to="/app/tarefas" replace />} />
      <Route path="/materiais" element={<Navigate to="/app/materiais" replace />} />
      <Route path="/grupos" element={<Navigate to="/app/grupos" replace />} />
      <Route path="*" element={<PlaceholderPage titulo="Página não encontrada" />} />
    </Routes>
  )
}
