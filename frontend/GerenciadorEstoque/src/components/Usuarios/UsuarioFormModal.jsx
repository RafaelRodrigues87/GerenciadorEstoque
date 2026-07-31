import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function UsuarioFormModal({ usuarioEmEdicao, onFechar, onSalvar }) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [papel, setPapel] = useState('OPERADOR')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const estaEditando = !!usuarioEmEdicao

  useEffect(() => {
    if (usuarioEmEdicao) {
      setNome(usuarioEmEdicao.nome)
      setEmail(usuarioEmEdicao.email)
      setPapel(usuarioEmEdicao.papel)
    }
  }, [usuarioEmEdicao])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      if (estaEditando) {
        await onSalvar({ nome, email, papel })
      } else {
        await onSalvar({ nome, email, senha, papel })
      }
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Não foi possível salvar o usuário')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            {estaEditando ? 'Editar usuário' : 'Novo usuário'}
          </h2>
          <button onClick={onFechar} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            <X size={18} />
          </button>
        </div>

        {erro && (
          <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Nome</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            maxLength={120}
            className="w-full mb-3 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />

          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-3 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />

          {!estaEditando && (
            <>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Senha inicial
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
                className="w-full mb-3 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              />
            </>
          )}

          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">Papel</label>
          <select
            value={papel}
            onChange={(e) => setPapel(e.target.value)}
            className="w-full mb-6 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          >
            <option value="OPERADOR">Operador</option>
            <option value="ADMIN">Admin</option>
          </select>

          {estaEditando && (
            <p className="text-xs text-neutral-400 -mt-4 mb-5">
              Para trocar a senha, é preciso ser o próprio usuário — vá em "Meu perfil".
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}