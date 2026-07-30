import { useState, useRef, useEffect } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

const opcoesFormaPagamento = [
  { valor: 'DINHEIRO', rotulo: 'Dinheiro' },
  { valor: 'PIX', rotulo: 'Pix' },
  { valor: 'CARTAO_CREDITO', rotulo: 'Cartão de crédito' },
  { valor: 'CARTAO_DEBITO', rotulo: 'Cartão de débito' },
]

export default function NovaVendaModal({ produtos, onFechar, onConfirmar }) {
  const [itens, setItens] = useState([])
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [textoBusca, setTextoBusca] = useState('')
  const [sugestoesVisiveis, setSugestoesVisiveis] = useState(false)
  const [quantidadeParaAdicionar, setQuantidadeParaAdicionar] = useState('1')
  const [formaPagamento, setFormaPagamento] = useState('DINHEIRO')
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const buscaRef = useRef(null)

  const produtosDisponiveis = produtos.filter((p) => p.ativo)

  // Filtro por nome, ignorando maiúsculas/minúsculas — normaliza os dois lados pra minúsculo antes de comparar
  const sugestoes = produtosDisponiveis.filter((p) =>
    p.nome.toLowerCase().includes(textoBusca.toLowerCase())
  )

  // Fecha a lista de sugestões ao clicar fora do campo de busca
  useEffect(() => {
    function aoClicarFora(evento) {
      if (buscaRef.current && !buscaRef.current.contains(evento.target)) {
        setSugestoesVisiveis(false)
      }
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  function handleTextoBuscaChange(valor) {
    setTextoBusca(valor)
    setSugestoesVisiveis(true)
    if (produtoSelecionado) {
      setProdutoSelecionado(null)
    }
  }

  function selecionarProduto(produto) {
    setProdutoSelecionado(produto)
    setTextoBusca(produto.nome)
    setSugestoesVisiveis(false)
  }

  function adicionarItem() {
    setErro('')
    const quantidade = Number(quantidadeParaAdicionar)

    if (!produtoSelecionado || quantidade <= 0) return

    const itemExistente = itens.find((i) => i.produtoId === produtoSelecionado.id)
    if (itemExistente) {
      setItens(
        itens.map((i) =>
          i.produtoId === produtoSelecionado.id
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i
        )
      )
    } else {
      setItens([
        ...itens,
        {
          produtoId: produtoSelecionado.id,
          nome: produtoSelecionado.nome,
          precoVenda: produtoSelecionado.precoVenda,
          quantidade,
        },
      ])
    }

    setProdutoSelecionado(null)
    setTextoBusca('')
    setQuantidadeParaAdicionar('1')
  }

  function removerItem(produtoId) {
    setItens(itens.filter((i) => i.produtoId !== produtoId))
  }

  const total = itens.reduce((soma, item) => soma + item.precoVenda * item.quantidade, 0)

  async function handleConfirmar() {
    if (itens.length === 0) {
      setErro('Adicione pelo menos um item à venda')
      return
    }

    setErro('')
    setSalvando(true)

    try {
      await onConfirmar({
        formaPagamento,
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
      })
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Não foi possível registrar a venda')
    } finally {
      setSalvando(false)
    }
  }

  const formatarMoeda = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            Nova venda
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

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1" ref={buscaRef}>
            <input
              type="text"
              value={textoBusca}
              onChange={(e) => handleTextoBuscaChange(e.target.value)}
              onFocus={() => setSugestoesVisiveis(true)}
              placeholder="Buscar produto..."
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />

            {sugestoesVisiveis && textoBusca && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg">
                {sugestoes.length === 0 ? (
                  <p className="text-sm text-neutral-400 text-center py-3">
                    Nenhum produto encontrado
                  </p>
                ) : (
                  sugestoes.map((produto) => (
                    <button
                      key={produto.id}
                      type="button"
                      onClick={() => selecionarProduto(produto)}
                      className="w-full text-left px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <span className="block">{produto.nome}</span>
                      <span className="block text-xs text-neutral-500 dark:text-neutral-400">
                        {formatarMoeda(produto.precoVenda)} · {produto.quantidadeAtual} em estoque
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <input
            type="number"
            min="1"
            value={quantidadeParaAdicionar}
            onChange={(e) => setQuantidadeParaAdicionar(e.target.value)}
            className="w-20 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
          <button
            type="button"
            onClick={adicionarItem}
            disabled={!produtoSelecionado}
            className="flex items-center justify-center w-10 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg mb-4 max-h-52 overflow-y-auto">
          {itens.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-6">
              Nenhum item adicionado ainda
            </p>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {itens.map((item) => (
                  <tr key={item.produtoId} className="border-b last:border-0 border-neutral-100 dark:border-neutral-800">
                    <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                      {item.nome}
                    </td>
                    <td className="px-3 py-2 text-center text-neutral-500 dark:text-neutral-400">
                      x{item.quantidade}
                    </td>
                    <td className="px-3 py-2 text-right text-neutral-900 dark:text-neutral-100">
                      {formatarMoeda(item.precoVenda * item.quantidade)}
                    </td>
                    <td className="px-2 py-2 text-right">
                      <button
                        onClick={() => removerItem(item.produtoId)}
                        className="text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Total</span>
          <span className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
            {formatarMoeda(total)}
          </span>
        </div>

        <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
          Forma de pagamento
        </label>
        <select
          value={formaPagamento}
          onChange={(e) => setFormaPagamento(e.target.value)}
          className="w-full mb-6 px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        >
          {opcoesFormaPagamento.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onFechar}
            className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={salvando}
            className="flex-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {salvando ? 'Registrando...' : 'Finalizar venda'}
          </button>
        </div>
      </div>
    </div>
  )
}