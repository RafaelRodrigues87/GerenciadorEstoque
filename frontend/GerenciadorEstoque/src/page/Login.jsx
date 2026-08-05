import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Package } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
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
    <div className="min-h-screen flex bg-white dark:bg-neutral-950">
      {/* Painel de marca */}
      <div className="hidden md:flex md:w-[42%] bg-neutral-900 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <Package size={15} className="text-neutral-900" />
          </div>
          <span className="font-medium text-white">EstoqueFácil</span>
        </div>

        <div className="relative">
          <h1 className="text-3xl font-medium text-white leading-tight mb-3">
            Controle total do seu estoque, em qualquer lugar.
          </h1>

          <p className="text-neutral-400 text-sm leading-relaxed">
            Acompanhe vendas, produtos e alertas de reposição em tempo real,
            direto do computador ou do celular.
          </p>
        </div>

        <p className="relative text-xs text-neutral-500">
          © 2026 EstoqueFácil
        </p>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">

          <h2 className="text-2xl font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Bem-vindo de volta
          </h2>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8">
            Entre com sua conta para acessar o painel
          </p>

          {erro && (
            <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {erro}
            </div>
          )}

          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            E-mail
          </label>

          <div className="relative mb-5">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full pl-11 pr-4 py-3 text-base border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Senha
          </label>

          <div className="relative mb-4">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              type={mostrarSenha ? 'text' : 'password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full pl-11 pr-11 py-3 text-base border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />

            <button
              type="button"
              onClick={() => setMostrarSenha((atual) => !atual)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              tabIndex={-1}
            >
              {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to="/EsqueciSenha"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-base font-medium py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>

        </form>
      </div>
    </div>
  )
}