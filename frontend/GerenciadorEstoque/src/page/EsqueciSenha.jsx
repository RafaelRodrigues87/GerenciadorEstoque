import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { authService } from '../services/authService'

export default function EsqueciSenha() {
  const [etapa, setEtapa] = useState('email') // 'email' | 'codigo' | 'sucesso'
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const navigate = useNavigate()

  async function handleSolicitarCodigo(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      await authService.esqueciSenha(email)
      setEtapa('codigo')
    } catch (err) {
      // Mesmo em erro de rede genérico, não confirmamos nem negamos se o e-mail existe
      setErro('Não foi possível processar sua solicitação. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  async function handleRedefinirSenha(e) {
    e.preventDefault()
    setErro('')

    if (novaSenha !== confirmarNovaSenha) {
      setErro('As senhas novas não coincidem')
      return
    }

    setCarregando(true)
    try {
      await authService.redefinirSenha(email, codigo, novaSenha)
      setEtapa('sucesso')
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Código inválido ou expirado')
    } finally {
      setCarregando(false)
    }
  }

  const classeInput =
    'w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100'

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
        {etapa === 'email' && (
          <>
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <Mail size={18} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Esqueceu sua senha?
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Digite seu e-mail e enviaremos um código de verificação
            </p>

            {erro && (
              <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                {erro}
              </div>
            )}

            <form onSubmit={handleSolicitarCodigo}>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className={`${classeInput} mb-5`}
              />

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
              >
                {carregando ? 'Enviando...' : 'Enviar código'}
              </button>
            </form>
          </>
        )}

        {etapa === 'codigo' && (
          <>
            <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
              <KeyRound size={18} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Digite o código
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Se <span className="font-medium text-neutral-700 dark:text-neutral-300">{email}</span> estiver
              cadastrado, um código de 6 dígitos foi enviado. Ele expira em 15 minutos.
            </p>

            {erro && (
              <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                {erro}
              </div>
            )}

            <form onSubmit={handleRedefinirSenha}>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Código
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                placeholder="000000"
                className={`${classeInput} mb-4 tracking-[0.3em] text-center font-medium`}
              />

              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Nova senha
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                minLength={6}
                className={`${classeInput} mb-4`}
              />

              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Confirmar nova senha
              </label>
              <input
                type="password"
                value={confirmarNovaSenha}
                onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                required
                minLength={6}
                className={`${classeInput} mb-5`}
              />

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 mb-3"
              >
                {carregando ? 'Redefinindo...' : 'Redefinir senha'}
              </button>

              <button
                type="button"
                onClick={() => setEtapa('email')}
                className="w-full text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              >
                Não recebi o código, tentar de novo
              </button>
            </form>
          </>
        )}

        {etapa === 'sucesso' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={22} className="text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              Senha redefinida!
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              Já pode entrar com sua nova senha.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
            >
              Ir para o login
            </button>
          </div>
        )}

        {etapa !== 'sucesso' && (
          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mt-6"
          >
            <ArrowLeft size={14} />
            Voltar para o login
          </Link>
        )}
      </div>
    </div>
  )
}