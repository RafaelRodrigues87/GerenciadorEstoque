import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { dashboardService } from '../services/dashboardService'
import { produtoService } from '../services/produtoService'
import {corCategoria} from "../components/cores/Categorias"
const CORES_CATEGORIA = [
  '#3b82f6', // Azul
  '#22c55e', // Verde
  '#f59e0b', // Amarelo
  '#ef4444', // Vermelho
  '#8b5cf6', // Roxo
  '#06b6d4', // Ciano
  '#ec4899', // Rosa
  '#84cc16', // Lima
]

export default function Dashboard() {
  const [resumo, setResumo] = useState(null)
  const [estoqueBaixo, setEstoqueBaixo] = useState([])
  const [vendasPorDia, setVendasPorDia] = useState([])
  const [estoquePorCategoria, setEstoquePorCategoria] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [dadosResumo, dadosEstoqueBaixo, dadosVendasPorDia, dadosProdutos] =
        await Promise.all([
          dashboardService.buscarResumo(),
          produtoService.listarComEstoqueBaixo(),
          dashboardService.buscarVendasPorDia(7),
          produtoService.listarTodos(),
        ])

      setResumo(dadosResumo)
      setEstoqueBaixo(dadosEstoqueBaixo)

      setVendasPorDia(
        dadosVendasPorDia.map((dia) => ({
          dia: new Date(dia.data + 'T00:00:00').toLocaleDateString('pt-BR', {
            weekday: 'short',
          }),
          total: dia.total,
        }))
      )

      const porCategoria = {}
      dadosProdutos
        .filter((p) => p.ativo)
        .forEach((produto) => {
          const valor = produto.precoCusto * produto.quantidadeAtual
          porCategoria[produto.categoriaNome] =
            (porCategoria[produto.categoriaNome] || 0) + valor
        })

      setEstoquePorCategoria(
        Object.entries(porCategoria)
          .map(([nome, valor]) => ({ nome, valor }))
          .sort((a, b) => b.valor - a.valor)
      )

      setCarregando(false)
    }

    carregar()
  }, [])

  if (carregando) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 p-6">
        Carregando...
      </p>
    )
  }

  const formatarMoeda = (valor) =>
    Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  const formatarMoedaCompacta = (valor) =>
    Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      notation: 'compact',
    })

  return (
    <div className="p-6">
      <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">
        Painel
      </h1>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Loja de acessórios · hoje
      </p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            Itens em estoque
          </p>
          <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
            {resumo.itensEmEstoque}
          </p>
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            Valor em estoque
          </p>
          <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
            {formatarMoeda(resumo.valorEmEstoque)}
          </p>
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            Vendas hoje
          </p>
          <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100">
            {formatarMoeda(resumo.vendasHoje)}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4">
          <p className="text-xs text-red-700 dark:text-red-400 mb-1">
            Estoque baixo
          </p>
          <p className="text-xl font-medium text-red-700 dark:text-red-400">
            {resumo.alertasEstoqueBaixo} itens
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Vendas nos últimos 7 dias
          </p>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={vendasPorDia}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="corVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#d4d4d4"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="dia"
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatarMoedaCompacta}
              />

              <Tooltip
                formatter={(valor) => formatarMoeda(valor)}
                contentStyle={{
                  backgroundColor: '#171717',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                }}
                labelStyle={{ color: '#fff' }}
              />

              <Bar
                dataKey="total"
                fill="url(#corVendas)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Estoque por categoria
          </p>

          {estoquePorCategoria.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-10">
              Sem dados ainda
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={estoquePorCategoria}
                    dataKey="valor"
                    nameKey="nome"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    stroke="none"
                  >
                  {estoquePorCategoria.map((categoria) => (
                      <Cell
                        key={categoria.nome}
                        fill={corCategoria(categoria.nome)}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    cursor={false}
                    formatter={(valor) => formatarMoeda(valor)}
                    contentStyle={{
                      backgroundColor: '#171717',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />

                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">
          Alertas de reposição
        </p>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-neutral-500 dark:text-neutral-400 text-left">
              <th className="font-normal pb-2">Produto</th>
              <th className="font-normal pb-2 text-center">Estoque</th>
              <th className="font-normal pb-2 text-right">Mínimo</th>
            </tr>
          </thead>

          <tbody>
            {estoqueBaixo.map((produto) => (
              <tr
                key={produto.id}
                className="border-t border-neutral-100 dark:border-neutral-800"
              >
                <td className="py-2 text-neutral-900 dark:text-neutral-100">
                  {produto.nome}
                </td>

                <td className="py-2 text-center text-red-700 dark:text-red-400 font-medium">
                  {produto.quantidadeAtual}
                </td>

                <td className="py-2 text-right text-neutral-500 dark:text-neutral-400">
                  {produto.quantidadeMinima}
                </td>
              </tr>
            ))}

            {estoqueBaixo.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-4 text-center text-neutral-400 dark:text-neutral-600"
                >
                  Nenhum produto com estoque baixo
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}