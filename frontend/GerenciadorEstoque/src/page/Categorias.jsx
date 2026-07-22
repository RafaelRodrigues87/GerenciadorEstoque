import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { CategoriaService } from '../services/categoriaService'
import CategoriaFormModal from '../components/categorias/CategoriaFormModal'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState(null)
  const [erroRemocao, setErroRemocao] = useState('')

  async function carregar() {
    setCarregando(true)
    const dados = await CategoriaService.listarTodos()
    setCategorias(dados)
    setCarregando(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  function abrirParaCriar() {
    setCategoriaEmEdicao(null)
    setErroRemocao('')
    setModalAberto(true)
  }

  function abrirParaEditar(categoria) {
    setCategoriaEmEdicao(categoria)
    setErroRemocao('')
    setModalAberto(true)
  }

  async function handleSalvar(dados) {
    if (categoriaEmEdicao) {
      await CategoriaService.atualizar(categoriaEmEdicao.id, dados)
    } else {
      await CategoriaService.criar(dados)
    }
    setModalAberto(false)
    await carregar()
  }

  async function handleRemover(categoria) {
    const confirmou = window.confirm(`Remover a categoria "${categoria.nome}"?`)
    if (!confirmou) return

    try {
      await CategoriaService.remover(categoria.id)
      await carregar()
    } catch (err) {
      setErroRemocao(
        err.response?.data?.mensagem ?? 'Não foi possível remover esta categoria'
      )
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
            Categorias
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Organize seus produtos por tipo
          </p>
        </div>
        <button
          onClick={abrirParaCriar}
          className="flex items-center gap-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <Plus size={16} />
          Nova categoria
        </button>
      </div>

      {erroRemocao && (
        <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {erroRemocao}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-left">
              <th className="font-medium px-4 py-3">Nome</th>
              <th className="font-medium px-4 py-3">Descrição</th>
              <th className="font-medium px-4 py-3 w-24 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-neutral-400">
                  Carregando...
                </td>
              </tr>
            )}

            {!carregando && categorias.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-neutral-400">
                  Nenhuma categoria cadastrada ainda
                </td>
              </tr>
            )}

            {categorias.map((categoria) => (
              <tr
                key={categoria.id}
                className="border-t border-neutral-100 dark:border-neutral-800"
              >
                <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                  {categoria.nome}
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {categoria.descricao || '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => abrirParaEditar(categoria)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleRemover(categoria)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400"
                      title="Remover"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <CategoriaFormModal
          categoriaEmEdicao={categoriaEmEdicao}
          onFechar={() => setModalAberto(false)}
          onSalvar={handleSalvar}
        />
      )}
    </div>
  )
}