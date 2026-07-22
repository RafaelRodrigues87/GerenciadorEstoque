import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function CategoriaFormModal({ categoriaEmEdicao, onFechar, onSalvar }) {
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const estaEditando = !!categoriaEmEdicao

  useEffect(() => {
    if (categoriaEmEdicao) {
      setNome(categoriaEmEdicao.nome)
      setDescricao(categoriaEmEdicao.descricao ?? '')
    }
  }, [categoriaEmEdicao])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      await onSalvar({ nome, descricao })
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Não foi possível salvar a categoria')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            {estaEditando ? 'Editar categoria' : 'Nova categoria'}
          </h2>
          <button
            onClick={onFechar}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>

        {erro && (
          <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            maxLength={80}
            className="w-full mb-4 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />

          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Descrição <span className="text-neutral-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            maxLength={255}
            className="w-full mb-6 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />

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