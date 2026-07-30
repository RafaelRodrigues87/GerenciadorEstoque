import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function ProdutoFormModal({ produtoEmEdicao, categorias, onFechar, onSalvar }) {
  const [nome, setNome] = useState('')
  const [categoriaId, setCategoriaId] = useState('')
  const [precoCusto, setPrecoCusto] = useState('')
  const [precoVenda, setPrecoVenda] = useState('')
  const [quantidadeAtual, setQuantidadeAtual] = useState('')
  const [quantidadeMinima, setQuantidadeMinima] = useState('')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const estaEditando = !!produtoEmEdicao

  useEffect(() => {
    if (produtoEmEdicao) {
      setNome(produtoEmEdicao.nome)
      setCategoriaId(String(produtoEmEdicao.categoriaId))
      setPrecoCusto(String(produtoEmEdicao.precoCusto))
      setPrecoVenda(String(produtoEmEdicao.precoVenda))
      setQuantidadeMinima(String(produtoEmEdicao.quantidadeMinima))
    }
  }, [produtoEmEdicao])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSalvando(true)

    const payload = {
      nome,
      categoriaId: Number(categoriaId),
      precoCusto: Number(precoCusto),
      precoVenda: Number(precoVenda),
      quantidadeMinima: Number(quantidadeMinima),
    }

    // A quantidade atual só é definida na criação — depois disso, qualquer
    // mudança de estoque precisa passar pelo ajuste (com registro de auditoria)
    if (!estaEditando) {
      payload.quantidadeAtual = Number(quantidadeAtual)
    }

    try {
      await onSalvar(payload)
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Não foi possível salvar o produto')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            {estaEditando ? 'Editar produto' : 'Novo produto'}
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
            maxLength={150}
            className="w-full mb-3 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />

          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Categoria
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            className="w-full mb-3 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          >
            <option value="" disabled>Selecione...</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Preço de custo
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precoCusto}
                onChange={(e) => setPrecoCusto(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Preço de venda
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={precoVenda}
                onChange={(e) => setPrecoVenda(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Estoque inicial
              </label>
              <input
                type="number"
                min="0"
                value={quantidadeAtual}
                onChange={(e) => setQuantidadeAtual(e.target.value)}
                required={!estaEditando}
                disabled={estaEditando}
                title={estaEditando ? 'Use "Ajustar estoque" para mudar a quantidade' : ''}
                placeholder={estaEditando ? String(produtoEmEdicao.quantidadeAtual) : ''}
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 disabled:bg-neutral-100 dark:disabled:bg-neutral-900 disabled:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Estoque mínimo
              </label>
              <input
                type="number"
                min="0"
                value={quantidadeMinima}
                onChange={(e) => setQuantidadeMinima(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
              />
            </div>
          </div>

          {estaEditando && (
            <p className="text-xs text-neutral-400 -mt-3 mb-5">
              Para mudar a quantidade em estoque, use o ajuste de estoque na listagem.
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