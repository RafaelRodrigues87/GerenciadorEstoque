import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, SlidersHorizontal, Search } from 'lucide-react'
import { produtoService } from '../services/produtoService'
import { CategoriaService } from '../services/CategoriaService'
import ProdutoFormModal from '../components/produtos/ProdutoFormModal'
import AjustarEstoqueModal from '../components/produtos/AjustarEstoqueModal'

export default function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroGeral, setErroGeral] = useState('')
  const [termoBusca, setTermoBusca] = useState('')

  const [modalFormAberto, setModalFormAberto] = useState(false)
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null)

  const [produtoParaAjustar, setProdutoParaAjustar] = useState(null)

  async function carregar() {
    setCarregando(true)
    const [dadosProdutos, dadosCategorias] = await Promise.all([
      produtoService.listarTodos(), 
      CategoriaService.listarTodos(),
    ])
    setProdutos(dadosProdutos)
    setCategorias(dadosCategorias)
    setCarregando(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  // Filtro por nome, ignorando maiúsculas/minúsculas
  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
  )

  function abrirParaCriar() {
    setProdutoEmEdicao(null)
    setErroGeral('')
    setModalFormAberto(true)
  }

  function abrirParaEditar(produto) {
    setProdutoEmEdicao(produto)
    setErroGeral('')
    setModalFormAberto(true)
  }

  async function handleSalvar(dados) {
    if (produtoEmEdicao) {
      await produtoService.atualizar(produtoEmEdicao.id, dados)
    } else {
      await produtoService.criar(dados)
    }
    setModalFormAberto(false)
    await carregar()
  }

  async function handleAjustar(ajuste) {
    await produtoService.ajustarEstoque(produtoParaAjustar.id, ajuste)
    setProdutoParaAjustar(null)
    await carregar()
  }

  async function handleInativar(produto) {
    const confirmou = window.confirm(`Inativar o produto "${produto.nome}"?`)
    if (!confirmou) return

    try {
      await produtoService.inativar(produto.id)
      await carregar()
    } catch (err) {
      setErroGeral(err.response?.data?.mensagem ?? 'Não foi possível inativar este produto')
    }
  }

  const formatarMoeda = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
            Produtos
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Catálogo e controle de estoque
          </p>
        </div>
        <button
          onClick={abrirParaCriar}
          className="flex items-center gap-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <Plus size={16} />
          Novo produto
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        />
      </div>

      {erroGeral && (
        <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {erroGeral}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-left">
              <th className="font-medium px-4 py-3">Produto</th>
              <th className="font-medium px-4 py-3">Categoria</th>
              <th className="font-medium px-4 py-3 text-right">Preço venda</th>
              <th className="font-medium px-4 py-3 text-center">Estoque</th>
              <th className="font-medium px-4 py-3 text-center">Status</th>
              <th className="font-medium px-4 py-3 w-28 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  Carregando...
                </td>
              </tr>
            )}

            {!carregando && produtosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  {termoBusca
                    ? 'Nenhum produto encontrado para essa busca'
                    : 'Nenhum produto cadastrado ainda'}
                </td>
              </tr>
            )}

            {produtosFiltrados.map((produto) => (
              <tr
                key={produto.id}
                className="border-t border-neutral-100 dark:border-neutral-800"
              >
                <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                  {produto.nome}
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {produto.categoriaNome}
                </td>
                <td className="px-4 py-3 text-right text-neutral-900 dark:text-neutral-100">
                  {formatarMoeda(produto.precoVenda)}
                </td>
                <td className="px-4 py-3 text-center text-neutral-900 dark:text-neutral-100">
                  {produto.quantidadeAtual}
                </td>
                <td className="px-4 py-3 text-center">
                  {produto.estoqueBaixo ? (
                    <span className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs font-medium px-2.5 py-1 rounded-md">
                      Baixo
                    </span>
                  ) : (
                    <span className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded-md">
                      Ok
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setProdutoParaAjustar(produto)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Ajustar estoque"
                    >
                      <SlidersHorizontal size={15} />
                    </button>
                    <button
                      onClick={() => abrirParaEditar(produto)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleInativar(produto)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400"
                      title="Inativar"
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

      {modalFormAberto && (
        <ProdutoFormModal
          produtoEmEdicao={produtoEmEdicao}
          categorias={categorias}
          onFechar={() => setModalFormAberto(false)}
          onSalvar={handleSalvar}
        />
      )}

      {produtoParaAjustar && (
        <AjustarEstoqueModal
          produto={produtoParaAjustar}
          onFechar={() => setProdutoParaAjustar(null)}
          onAjustar={handleAjustar}
        />
      )}
    </div>
  )
}