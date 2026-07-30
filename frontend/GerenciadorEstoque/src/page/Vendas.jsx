import { useEffect, useState } from 'react'
import { Plus, Eye, Ban } from 'lucide-react'
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

const TAMANHO_PAGINA = 20

export default function Vendas() {
  const { usuario } = useAuth()
  const ehAdmin = usuario?.papel === 'ADMIN'

  const [vendas, setVendas] = useState([])
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroGeral, setErroGeral] = useState('')

  const [filtroStatus, setFiltroStatus] = useState('') // '' = todas
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

  // Sempre que o filtro muda, volta pra primeira página — senão o usuário
  // pode ficar "preso" numa página que não existe mais no resultado filtrado
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

      <div className="mb-4">
        <select
          value={filtroStatus}
          onChange={(e) => handleMudarFiltro(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        >
          <option value="">Todas as vendas</option>
          <option value="CONCLUIDA">Concluídas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
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
              <th className="font-medium px-4 py-3">Data</th>
              <th className="font-medium px-4 py-3">Vendedor</th>
              <th className="font-medium px-4 py-3">Pagamento</th>
              <th className="font-medium px-4 py-3 text-right">Total</th>
              <th className="font-medium px-4 py-3 text-center">Status</th>
              <th className="font-medium px-4 py-3 w-24 text-right">Ações</th>
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

            {!carregando && vendas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  Nenhuma venda encontrada
                </td>
              </tr>
            )}

            {vendas.map((venda) => (
              <tr key={venda.id} className="border-t border-neutral-100 dark:border-neutral-800">
                <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                  {formatarData(venda.dataHora)}
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {venda.usuarioNome}
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {rotulosFormaPagamento[venda.formaPagamento]}
                </td>
                <td className="px-4 py-3 text-right text-neutral-900 dark:text-neutral-100">
                  {formatarMoeda(venda.valorTotal)}
                </td>
                <td className="px-4 py-3 text-center">
                  {venda.status === 'CANCELADA' ? (
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-medium px-2.5 py-1 rounded-md">
                      Cancelada
                    </span>
                  ) : (
                    <span className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded-md">
                      Concluída
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => abrirDetalhes(venda)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Ver detalhes"
                    >
                      <Eye size={15} />
                    </button>
                    {ehAdmin && venda.status === 'CONCLUIDA' && (
                      <button
                        onClick={() => handleCancelar(venda)}
                        className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400"
                        title="Cancelar venda"
                      >
                        <Ban size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          onMudarPagina={setPaginaAtual}
        />
      </div>

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