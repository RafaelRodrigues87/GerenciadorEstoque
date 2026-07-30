import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { movimentacaoService } from '../services/MovimentacaoService'

const rotulosTipo = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  AJUSTE: 'Ajuste',
}

const coresTipo = {
  ENTRADA: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400',
  SAIDA: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400',
  AJUSTE: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
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
      // Mais recentes primeiro
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

      <div className="flex gap-3 mb-4">
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

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-left">
              <th className="font-medium px-4 py-3">Data</th>
              <th className="font-medium px-4 py-3">Produto</th>
              <th className="font-medium px-4 py-3 text-center">Tipo</th>
              <th className="font-medium px-4 py-3 text-center">Quantidade</th>
              <th className="font-medium px-4 py-3">Motivo</th>
              <th className="font-medium px-4 py-3">Responsável</th>
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

            {!carregando && movimentacoesFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  {termoBusca || filtroTipo !== 'TODOS'
                    ? 'Nenhuma movimentação encontrada para esse filtro'
                    : 'Nenhuma movimentação registrada ainda'}
                </td>
              </tr>
            )}

            {movimentacoesFiltradas.map((movimentacao) => (
              <tr
                key={movimentacao.id}
                className="border-t border-neutral-100 dark:border-neutral-800"
              >
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {formatarData(movimentacao.dataHora)}
                </td>
                <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                  {movimentacao.produtoNome}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-md ${coresTipo[movimentacao.tipo]}`}
                  >
                    {rotulosTipo[movimentacao.tipo]}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-neutral-900 dark:text-neutral-100">
                  {movimentacao.quantidade}
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {movimentacao.motivo || '—'}
                </td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                  {movimentacao.usuarioNome}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}