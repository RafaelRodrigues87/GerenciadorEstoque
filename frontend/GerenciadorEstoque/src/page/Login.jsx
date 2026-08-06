import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Package, KeyRound, ArrowLeft, CheckCircle2, X } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { authService } from '../services/authService'

export default function Login() {
  // Estados do Login
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  // Estados do Modal Esqueci a Senha
  const [modalAberto, setModalAberto] = useState(false)
  const [etapa, setEtapa] = useState('email') // 'email' | 'codigo' | 'sucesso'
  const [emailRecuperacao, setEmailRecuperacao] = useState('')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
  const [erroModal, setErroModal] = useState('')
  const [carregandoModal, setCarregandoModal] = useState(false)

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

  // Funções do Modal
  function abrirModal() {
    setEtapa('email')
    setEmailRecuperacao(email) // Preenche o e-mail se o usuário já tiver digitado na tela de login
    setCodigo('')
    setNovaSenha('')
    setConfirmarNovaSenha('')
    setErroModal('')
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  async function handleSolicitarCodigo(e) {
    e.preventDefault()
    setErroModal('')
    setCarregandoModal(true)

    try {
      await authService.esqueciSenha(emailRecuperacao)
      setEtapa('codigo')
    } catch (err) {
      setErroModal('Não foi possível processar sua solicitação. Tente novamente.')
    } finally {
      setCarregandoModal(false)
    }
  }

  async function handleRedefinirSenha(e) {
    e.preventDefault()
    setErroModal('')

    if (novaSenha !== confirmarNovaSenha) {
      setErroModal('As senhas novas não coincidem')
      return
    }

    setCarregandoModal(true)
    try {
      await authService.redefinirSenha(emailRecuperacao, codigo, novaSenha)
      setEtapa('sucesso')
    } catch (err) {
      setErroModal(err.response?.data?.mensagem ?? 'Código inválido ou expirado')
    } finally {
      setCarregandoModal(false)
    }
  }

  const classeInputModal =
    'w-full px-3 py-2.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100'

  return (
    <div className="min-h-screen flex bg-white dark:bg-neutral-950">
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

        <p className="relative text-xs text-neutral-500">© 2026 EstoqueFácil</p>
      </div>

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
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full pl-11 pr-4 py-3 text-base border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Senha
            </label>
            <button
              type="button"
              onClick={abrirModal}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              Esqueci minha senha
            </button>
          </div>
          <div className="relative mb-8">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
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

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-base font-medium py-3 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      {/* MODAL ESQUECI A SENHA */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 relative shadow-xl">
            <button
              onClick={fecharModal}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <X size={18} />
            </button>

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

                {erroModal && (
                  <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                    {erroModal}
                  </div>
                )}

                <form onSubmit={handleSolicitarCodigo}>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    required
                    autoFocus
                    className={`${classeInputModal} mb-5`}
                  />

                  <button
                    type="submit"
                    disabled={carregandoModal}
                    className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
                  >
                    {carregandoModal ? 'Enviando...' : 'Enviar código'}
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
                  Se <span className="font-medium text-neutral-700 dark:text-neutral-300">{emailRecuperacao}</span> estiver
                  cadastrado, um código de 6 dígitos foi enviado. Ele expira em 15 minutos.
                </p>

                {erroModal && (
                  <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
                    {erroModal}
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
                    className={`${classeInputModal} mb-4 tracking-[0.3em] text-center font-medium`}
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
                    className={`${classeInputModal} mb-4`}
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
                    className={`${classeInputModal} mb-5`}
                  />

                  <button
                    type="submit"
                    disabled={carregandoModal}
                    className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 mb-3"
                  >
                    {carregandoModal ? 'Redefinindo...' : 'Redefinir senha'}
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
                  onClick={fecharModal}
                  className="w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
                >
                  Ir para o login
                </button>
              </div>
            )}

            {etapa !== 'sucesso' && (
              <button
                type="button"
                onClick={fecharModal}
                className="flex items-center justify-center gap-1.5 w-full text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mt-6"
              >
                <ArrowLeft size={14} />
                Voltar para o login
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}