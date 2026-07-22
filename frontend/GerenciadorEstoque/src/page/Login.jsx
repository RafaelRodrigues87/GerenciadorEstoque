import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await login(email, senha)
      navigate('/')
    } catch (err) {
      setErro('E-mail ou senha inválidos')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8"
      >
        <h1 className="text-xl font-medium text-neutral-900 dark:text-neutral-100 mb-1">Bem-vindo de volta</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Entre com sua conta para acessar o painel</p>

        {erro && (
          <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {erro}
          </div>
        )}

        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        />

        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Senha</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full mb-6 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        />

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}