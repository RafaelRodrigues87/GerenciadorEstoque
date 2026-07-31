import { useState } from 'react'
import { User, Lock, Check } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { usuarioService } from '../services/usuarioService'

export default function MeuPerfil() {
  const { usuario, atualizarUsuarioLocal } = useAuth()

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

  const iniciais = usuario?.nome
    ?.split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

  const rotulosPapel = { ADMIN: 'Administrador', OPERADOR: 'Operador' }

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

  async function handleAlterarSenha(e) {
    e.preventDefault()
    setErroSenha('')
    setSucessoSenha(false)

    if (novaSenha !== confirmarNovaSenha) {
      setErroSenha('As senhas novas não coincidem')
      return
    }

    setSalvandoSenha(true)
    try {
      await usuarioService.alterarSenha({ senhaAtual, novaSenha })
      setSucessoSenha(true)
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarNovaSenha('')
      setTimeout(() => setSucessoSenha(false), 3000)
    } catch (err) {
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
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">{usuario?.email}</span>
            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span className="text-xs font-medium bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md">
              {rotulosPapel[usuario?.papel]}
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
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

          <form onSubmit={handleAlterarSenha}>
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
              disabled={salvandoSenha}
              className="flex items-center justify-center gap-1.5 w-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
            >
              {sucessoSenha ? (
                <>
                  <Check size={15} /> Senha alterada
                </>
              ) : salvandoSenha ? (
                'Salvando...'
              ) : (
                'Alterar senha'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}