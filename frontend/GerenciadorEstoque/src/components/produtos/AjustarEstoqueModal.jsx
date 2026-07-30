import { useState } from 'react'
import { X } from 'lucide-react'

const opcoesTipo = [
  { valor: 'ENTRADA', rotulo: 'Entrada (reposição)' },
  { valor: 'SAIDA', rotulo: 'Saída (perda, troca...)' },
  { valor: 'AJUSTE', rotulo: 'Ajuste (contagem física)' },
]

export default function AjustarEstoqueModal({ produto, onFechar, onAjustar }) {
  const [tipo, setTipo] = useState('ENTRADA')
  const [quantidade, setQuantidade] = useState('')
  const [motivo, setMotivo] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      await onAjustar({ tipo, quantidade: Number(quantidade), motivo })
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Não foi possível ajustar o estoque')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            Ajustar estoque
          </h2>
          <button
            onClick={onFechar}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
          {produto.nome} · estoque atual: {produto.quantidadeAtual}
        </p>

        {erro && (
          <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full mb-3 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          >
            {opcoesTipo.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>

          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {tipo === 'AJUSTE' ? 'Quantidade real contada' : 'Quantidade'}
          </label>
          <input
            type="number"
            min="0"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
            className="w-full mb-3 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />

          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Motivo <span className="text-neutral-400">(opcional)</span>
          </label>
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
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
              {salvando ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}