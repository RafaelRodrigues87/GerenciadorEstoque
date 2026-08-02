import { useEffect, useState } from 'react'
import { User, Lock, Check, Settings, ShieldAlert, Mail, Monitor, Trash2 } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useTheme } from '../theme/ThemeContext'
import { usuarioService } from '../services/usuarioService'
import ConfirmModal from '../components/common/ConfirmModal'

export default function MeuPerfil() {
  const { usuario, atualizarUsuarioLocal } = useAuth()
  const { tema, alternarTema } = useTheme()

  const [criadoEm, setCriadoEm] = useState(null)

  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [erroPerfil, setErroPerfil] = useState('')
  const [sucessoPerfil, setSucessoPerfil] = useState(false)
  const [salvandoPerfil, setSalvandoPerfil] = useState(false)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
  const [erroSenha, setErroSenha] = useState('')
  const [sucessoSenha, setSucessoSenha] = useState(false)
  const [salvandoSenha, setSalvandoSenha] = useState(false)
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false)

  const [notificacoesPorEmail, setNotificacoesPorEmail] = useState(true)

  // Busca o perfil completo (o AuthContext só guarda nome/email/papel, não criadoEm)
  useEffect(() => {
    usuarioService.buscarMeuPerfil().then((dados) => setCriadoEm(dados.criadoEm))
  }, [])

  const iniciais = usuario?.nome
    ?.split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

  const rotulosPapel = { ADMIN: 'Administrador', OPERADOR: 'Operador' }

  const formatarMembroDesde = (data) => {
    if (!data) return null
    return new Date(data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  }

  async function handleSalvarPerfil(e) {
    e.preventDefault()
    setErroPerfil('')
    setSucessoPerfil(false)
    setSalvandoPerfil(true)

    try {
      const atualizado = await usuarioService.atualizarMeuPerfil({ nome, email })
      atualizarUsuarioLocal({ nome: atualizado.nome, email: atualizado.email })
      setSucessoPerfil(true)
      setTimeout(() => setSucessoPerfil(false), 3000)
    } catch (err) {
      setErroPerfil(err.response?.data?.mensagem ?? 'Não foi possível atualizar seus dados')
    } finally {
      setSalvandoPerfil(false)
    }
  }

  function handleSubmitSenha(e) {
    e.preventDefault()
    setErroSenha('')

    if (novaSenha !== confirmarNovaSenha) {
      setErroSenha('As senhas novas não coincidem')
      return
    }

    setModalConfirmacaoAberto(true)
  }

  async function confirmarTrocaSenha() {
    setErroSenha('')
    setSalvandoSenha(true)

    try {
      await usuarioService.alterarSenha({ senhaAtual, novaSenha })
      setModalConfirmacaoAberto(false)
      setSucessoSenha(true)
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarNovaSenha('')
      setTimeout(() => setSucessoSenha(false), 3000)
    } catch (err) {
      setModalConfirmacaoAberto(false)
      setErroSenha(err.response?.data?.mensagem ?? 'Não foi possível alterar a senha')
    } finally {
      setSalvandoSenha(false)
    }
  }

  const classeInput =
    'w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-shadow'

  const classeLabel = 'block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5'

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xl font-medium text-white shrink-0">
          {iniciais}
        </div>
        <div>
          <h1 className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
            {usuario?.nome}
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{usuario?.email}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md">
              {rotulosPapel[usuario?.papel]}
            </span>
            {criadoEm && (
              <>
                <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                <span className="text-xs text-neutral-400">
                  Membro desde {formatarMembroDesde(criadoEm)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* Dados pessoais */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <User size={15} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Dados pessoais</p>
              <p className="text-xs text-neutral-400">Nome e e-mail de acesso</p>
            </div>
          </div>

          {erroPerfil && (
            <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {erroPerfil}
            </div>
          )}

          <form onSubmit={handleSalvarPerfil}>
            <label className={classeLabel}>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className={`${classeInput} mb-4`}
            />

            <label className={classeLabel}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${classeInput} mb-5`}
            />

            <button
              type="submit"
              disabled={salvandoPerfil}
              className="flex items-center justify-center gap-1.5 w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
            >
              {sucessoPerfil ? (
                <>
                  <Check size={15} /> Salvo
                </>
              ) : salvandoPerfil ? (
                'Salvando...'
              ) : (
                'Salvar dados'
              )}
            </button>
          </form>
        </div>

        {/* Trocar senha */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Lock size={15} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Segurança</p>
              <p className="text-xs text-neutral-400">Trocar sua senha de acesso</p>
            </div>
          </div>

          {erroSenha && (
            <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
              {erroSenha}
            </div>
          )}

          <form onSubmit={handleSubmitSenha}>
            <label className={classeLabel}>Senha atual</label>
            <input
              type="password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
              className={`${classeInput} mb-4`}
            />

            <label className={classeLabel}>Nova senha</label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              minLength={6}
              className={`${classeInput} mb-4`}
            />

            <label className={classeLabel}>Confirmar nova senha</label>
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
              className="flex items-center justify-center gap-1.5 w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
            >
              {sucessoSenha ? (
                <>
                  <Check size={15} /> Senha alterada
                </>
              ) : (
                'Alterar senha'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Preferências */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Settings size={15} className="text-neutral-600 dark:text-neutral-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Preferências</p>
            <p className="text-xs text-neutral-400">Como o sistema se comporta pra você</p>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="text-sm text-neutral-900 dark:text-neutral-100">Modo escuro</p>
            <p className="text-xs text-neutral-400">Alterna o tema claro/escuro do sistema</p>
          </div>
          <button
            onClick={alternarTema}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
              tema === 'escuro' ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-900 transition-transform ${
                tema === 'escuro' ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-start gap-2.5">
            <Mail size={16} className="text-neutral-400 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-900 dark:text-neutral-100">
                Notificações por e-mail
              </p>
              <p className="text-xs text-neutral-400">
                Avisos de estoque baixo e resumo diário — em breve
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotificacoesPorEmail((atual) => !atual)}
            disabled
            title="Ainda não implementado"
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 opacity-40 cursor-not-allowed ${
              notificacoesPorEmail ? 'bg-neutral-900 dark:bg-neutral-100' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white dark:bg-neutral-900 transition-transform ${
                notificacoesPorEmail ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-start gap-2.5">
            <Monitor size={16} className="text-neutral-400 mt-0.5" />
            <div>
              <p className="text-sm text-neutral-900 dark:text-neutral-100">Sessões ativas</p>
              <p className="text-xs text-neutral-400">Sair de todos os dispositivos conectados</p>
            </div>
          </div>
          <button
            disabled
            title="Ainda não implementado"
            className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
          >
            Encerrar sessões
          </button>
        </div>
      </div>

      {/* Zona de perigo */}
      <div className="bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-900 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950 flex items-center justify-center">
            <ShieldAlert size={15} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Zona de perigo</p>
            <p className="text-xs text-neutral-400">Ações permanentes na sua conta</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-900 dark:text-neutral-100">Excluir minha conta</p>
            <p className="text-xs text-neutral-400">Essa ação não pode ser desfeita — em breve</p>
          </div>
          <button
            disabled
            title="Ainda não implementado"
            className="flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-300 dark:text-red-800 cursor-not-allowed"
          >
            <Trash2 size={14} />
            Excluir conta
          </button>
        </div>
      </div>

      {modalConfirmacaoAberto && (
        <ConfirmModal
          titulo="Trocar senha?"
          mensagem="Você vai precisar da nova senha no próximo login. Confirma a troca?"
          textoConfirmar="Sim, trocar senha"
          confirmando={salvandoSenha}
          onConfirmar={confirmarTrocaSenha}
          onFechar={() => setModalConfirmacaoAberto(false)}
        />
      )}
    </div>
  )
}