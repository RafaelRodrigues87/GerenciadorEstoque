import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RotaPrivada({ children }) {
  const { estaLogado } = useAuth()

  if (!estaLogado) {
    return <Navigate to="/login" replace />
  }

  return children
}