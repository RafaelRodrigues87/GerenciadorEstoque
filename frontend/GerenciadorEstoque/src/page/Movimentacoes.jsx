import { useEffect, useState } from 'react'
import { Search, ArrowUpCircle, ArrowDownCircle, SlidersHorizontal, History } from 'lucide-react'
import { movimentacaoService } from '../services/MovimentacaoService'

const rotulosTipo = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  AJUSTE: 'Ajuste',
}

const iconesTipo = {
  ENTRADA: ArrowUpCircle,
  SAIDA: ArrowDownCircle,
  AJUSTE: SlidersHorizontal,
}

const coresIconeTipo = {
  ENTRADA: 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400',
  SAIDA: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400',
  AJUSTE: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
}

const sinalQuantidade = {
  ENTRADA: '+',
  SAIDA: '−',
  AJUSTE: '',
}

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [termoBusca, setTermoBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('TODOS')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      const dados = await movimentacaoService.listarTodas()
      setMovimentacoes([...dados].sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora)))
      setCarregando(false)
    }
    carregar()
  }, [])

  const movimentacoesFiltradas = movimentacoes.filter((movimentacao) => {
    const bateBusca = movimentacao.produtoNome.toLowerCase().includes(termoBusca.toLowerCase())
    const bateTipo = filtroTipo === 'TODOS' || movimentacao.tipo === filtroTipo
    return bateBusca && bateTipo
  })

  const formatarData = (data) =>
    new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
          Movimentações
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Histórico de entradas, saídas e ajustes de estoque
        </p>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar por produto..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>

        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
        >
          <option value="TODOS">Todos os tipos</option>
          <option value="ENTRADA">Entrada</option>
          <option value="SAIDA">Saída</option>
          <option value="AJUSTE">Ajuste</option>
        </select>
      </div>

      {carregando && (
        <p className="text-sm text-neutral-400 text-center py-10">Carregando...</p>
      )}

      {!carregando && movimentacoesFiltradas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <History size={28} className="mb-2 opacity-50" />
          <p className="text-sm">
            {termoBusca || filtroTipo !== 'TODOS'
              ? 'Nenhuma movimentação encontrada para esse filtro'
              : 'Nenhuma movimentação registrada ainda'}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {movimentacoesFiltradas.map((movimentacao) => {
          const Icone = iconesTipo[movimentacao.tipo]

          return (
            <div
              key={movimentacao.id}
              className="flex items-center gap-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${coresIconeTipo[movimentacao.tipo]}`}
              >
                <Icone size={17} />
              </div>

              <div className="w-32 shrink-0">
                <p className="text-sm text-neutral-900 dark:text-neutral-100">
                  {formatarData(movimentacao.dataHora)}
                </p>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  {movimentacao.produtoNome}
                </p>
                <p className="text-xs text-neutral-400 truncate">
                  {movimentacao.motivo || rotulosTipo[movimentacao.tipo]} · {movimentacao.usuarioNome}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-md shrink-0 ${coresIconeTipo[movimentacao.tipo]}`}
              >
                {rotulosTipo[movimentacao.tipo]}
              </span>

              <p className="text-base font-medium text-neutral-900 dark:text-neutral-100 w-16 text-right shrink-0">
                {sinalQuantidade[movimentacao.tipo]}{movimentacao.quantidade}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}