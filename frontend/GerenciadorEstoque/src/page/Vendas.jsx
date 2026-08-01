import { useEffect, useState } from 'react'
import {
  Plus, Eye, Ban, CheckCircle2, XCircle, ShoppingBag,
  Banknote, QrCode, CreditCard,
} from 'lucide-react'
import { vendaService } from '../services/VendaService'
import { produtoService } from '../services/produtoService'
import { useAuth } from '../auth/AuthContext'
import NovaVendaModal from '../components/vendas/NovaVendaModal'
import VendaDetalhesModal from '../components/vendas/VendaDetalhesModal'
import Pagination from "../components/common/Pagination"

const rotulosFormaPagamento = {
  DINHEIRO: 'Dinheiro',
  PIX: 'Pix',
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO_DEBITO: 'Cartão de débito',
}

const iconesFormaPagamento = {
  DINHEIRO: Banknote,
  PIX: QrCode,
  CARTAO_CREDITO: CreditCard,
  CARTAO_DEBITO: CreditCard,
}

const TAMANHO_PAGINA = 20

export default function Vendas() {
  const { usuario } = useAuth()
  const ehAdmin = usuario?.papel === 'ADMIN'

  const [vendas, setVendas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroGeral, setErroGeral] = useState('')

  const [filtroStatus, setFiltroStatus] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)

  const [modalNovaVendaAberto, setModalNovaVendaAberto] = useState(false)
  const [vendaSelecionada, setVendaSelecionada] = useState(null)

  async function carregarVendas() {
    setCarregando(true)
    const pagina = await vendaService.listarPaginado({
      pagina: paginaAtual,
      tamanho: TAMANHO_PAGINA,
      status: filtroStatus || undefined,
    })
    setVendas(pagina.content)
    setTotalPaginas(pagina.totalPages)
    setCarregando(false)
  }

  useEffect(() => {
    carregarVendas()
  }, [paginaAtual, filtroStatus])

  useEffect(() => {
    produtoService.listarTodos().then(setProdutos)
  }, [])

  function handleMudarFiltro(novoStatus) {
    setFiltroStatus(novoStatus)
    setPaginaAtual(0)
  }

  async function handleConfirmarVenda(dadosVenda) {
    await vendaService.criar(dadosVenda)
    setModalNovaVendaAberto(false)
    setErroGeral('')
    await carregarVendas()
  }

  async function abrirDetalhes(venda) {
    const vendaCompleta = await vendaService.buscarPorId(venda.id)
    setVendaSelecionada(vendaCompleta)
  }

  async function handleCancelar(venda) {
    const confirmou = window.confirm(
      `Cancelar a venda #${venda.id}? O estoque dos itens será devolvido.`
    )
    if (!confirmou) return

    try {
      await vendaService.cancelar(venda.id)
      await carregarVendas()
    } catch (err) {
      setErroGeral(err.response?.data?.mensagem ?? 'Não foi possível cancelar esta venda')
    }
  }

  const formatarMoeda = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const formatarData = (data) =>
    new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

  // Resumo rápido da página atual — só das vendas concluídas visíveis agora
  const vendasConcluidasNaPagina = vendas.filter((v) => v.status === 'CONCLUIDA')
  const totalNaPagina = vendasConcluidasNaPagina.reduce((soma, v) => soma + v.valorTotal, 0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
            Vendas
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Histórico e registro de vendas
          </p>
        </div>
        <button
          onClick={() => setModalNovaVendaAberto(true)}
          className="flex items-center gap-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <Plus size={16} />
          Nova venda
        </button>
      </div>

      <div className="flex items-center justify-between mb-5">
        <select
          value={filtroStatus}
          onChange={(e) => handleMudarFiltro(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        >
          <option value="">Todas as vendas</option>
          <option value="CONCLUIDA">Concluídas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>

        {!carregando && vendas.length > 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {vendasConcluidasNaPagina.length} {vendasConcluidasNaPagina.length === 1 ? 'venda' : 'vendas'} nesta página ·{' '}
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {formatarMoeda(totalNaPagina)}
            </span>
          </p>
        )}
      </div>

      {erroGeral && (
        <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {erroGeral}
        </div>
      )}

      {carregando && (
        <p className="text-sm text-neutral-400 text-center py-10">Carregando...</p>
      )}

      {!carregando && vendas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <ShoppingBag size={28} className="mb-2 opacity-50" />
          <p className="text-sm">Nenhuma venda encontrada</p>
        </div>
      )}

      <div className="flex flex-col gap-2.5 mb-4">
        {vendas.map((venda) => {
          const cancelada = venda.status === 'CANCELADA'
          const IconePagamento = iconesFormaPagamento[venda.formaPagamento]

          return (
            <div
              key={venda.id}
              className={`group flex items-center gap-4 bg-white dark:bg-neutral-900 border rounded-xl px-4 py-3.5 hover:shadow-sm transition-all ${
                cancelada
                  ? 'border-neutral-200 dark:border-neutral-800 opacity-70'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  cancelada
                    ? 'bg-red-50 dark:bg-red-950'
                    : 'bg-green-50 dark:bg-green-950'
                }`}
              >
                {cancelada ? (
                  <XCircle size={17} className="text-red-500 dark:text-red-400" />
                ) : (
                  <CheckCircle2 size={17} className="text-green-600 dark:text-green-400" />
                )}
              </div>

              <div className="w-32 shrink-0">
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                  {formatarData(venda.dataHora)}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  {venda.usuarioNome}
                </p>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <IconePagamento size={12} />
                  {rotulosFormaPagamento[venda.formaPagamento]}
                </div>
              </div>

             <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-md shrink-0 w-24 text-center ${
                    cancelada
                      ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950'
                      : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950'
                  }`}
                >
                  {cancelada ? 'Cancelada' : 'Concluída'}
                </span>

              <p
                className={`text-base font-medium w-28 text-right shrink-0 ${
                  cancelada
                    ? 'text-neutral-400 dark:text-neutral-500 line-through'
                    : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {formatarMoeda(venda.valorTotal)}
              </p>

              <div className="w-16 flex justify-end gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => abrirDetalhes(venda)}
                  className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Ver detalhes"
                >
                  <Eye size={15} />
                </button>
                {ehAdmin && !cancelada && (
                  <button
                    onClick={() => handleCancelar(venda)}
                    className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400"
                    title="Cancelar venda"
                  >
                    <Ban size={15} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {totalPaginas > 1 && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <Pagination
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onMudarPagina={setPaginaAtual}
          />
        </div>
      )}

      {modalNovaVendaAberto && (
        <NovaVendaModal
          produtos={produtos}
          onFechar={() => setModalNovaVendaAberto(false)}
          onConfirmar={handleConfirmarVenda}
        />
      )}

      {vendaSelecionada && (
        <VendaDetalhesModal
          venda={vendaSelecionada}
          onFechar={() => setVendaSelecionada(null)}
        />
      )}
    </div>
  )
}