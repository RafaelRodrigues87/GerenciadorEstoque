import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'
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

      {carregando && (
        <p className="text-sm text-neutral-400 text-center py-10">Carregando...</p>
      )}

      {!carregando && categorias.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <Tag size={28} className="mb-2 opacity-50" />
          <p className="text-sm">Nenhuma categoria cadastrada ainda</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Tag size={16} className="text-neutral-600 dark:text-neutral-400" />
              </div>

              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => abrirParaEditar(categoria)}
                  className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleRemover(categoria)}
                  className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400"
                  title="Remover"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
              {categoria.nome}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {categoria.descricao || 'Sem descrição'}
            </p>
          </div>
        ))}
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