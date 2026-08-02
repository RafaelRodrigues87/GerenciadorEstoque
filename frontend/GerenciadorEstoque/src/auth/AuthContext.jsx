import { createContext, useContext, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token')
  })

  async function login(email, senha) {
    const resposta = await authService.login(email, senha)

    localStorage.setItem('token', resposta.token)
    localStorage.setItem(
      'usuario',
      JSON.stringify({
        nome: resposta.nome,
        email: resposta.email,
        papel: resposta.papel,
      })
    )

    setToken(resposta.token)
    setUsuario({
      nome: resposta.nome,
      email: resposta.email,
      papel: resposta.papel,
    })
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    setToken(null)
    setUsuario(null)
  }

  // Atualiza os dados do usuário após editar o perfil
  function atualizarUsuarioLocal(dadosAtualizados) {
    const novoUsuario = { ...usuario, ...dadosAtualizados }

    localStorage.setItem('usuario', JSON.stringify(novoUsuario))
    setUsuario(novoUsuario)
  }

  const estaLogado = !!token && !!usuario

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        estaLogado,
        atualizarUsuarioLocal,
      }}
    >
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