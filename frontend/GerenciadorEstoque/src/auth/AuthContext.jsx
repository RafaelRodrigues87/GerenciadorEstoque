import { createContext, useContext, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  async function login(email, senha) {
    const resposta = await authService.login(email, senha)

    localStorage.setItem('token', resposta.token)
    localStorage.setItem('usuario', JSON.stringify({
      nome: resposta.nome,
      email: resposta.email,
      papel: resposta.papel,
    }))
    setUsuario({ nome: resposta.nome, email: resposta.email, papel: resposta.papel })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  const estaLogado = !!usuario

  return (
    <AuthContext.Provider value={{ usuario, login, logout, estaLogado }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
  }
  return context
}