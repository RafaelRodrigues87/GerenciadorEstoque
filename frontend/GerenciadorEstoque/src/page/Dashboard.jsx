import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboardService'
import { produtoService } from '../services/produtoService'

export default function Dashboard() {
  const [resumo, setResumo] = useState(null)
  const [estoqueBaixo, setEstoqueBaixo] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [dadosResumo, dadosEstoqueBaixo] = await Promise.all([
        dashboardService.buscarResumo(),
        produtoService.listarComEstoqueBaixo(),
      ])
      setResumo(dadosResumo)
      setEstoqueBaixo(dadosEstoqueBaixo)
      setCarregando(false)
    }
    carregar()
  }, [])

  if (carregando) {
    return <p className="text-sm text-neutral-500 dark:text-neutral-400 p-6">Carregando...</p>
  }

  const formatarMoeda = (valor) =>
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="p-6">
      <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">Painel</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Loja de acessórios · hoje</p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Itens em estoque</p>
          <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100">{resumo.itensEmEstoque}</p>
        </div>
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Valor em estoque</p>
          <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100">{formatarMoeda(resumo.valorEmEstoque)}</p>
        </div>
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Vendas hoje</p>
          <p className="text-xl font-medium text-neutral-900 dark:text-neutral-100">{formatarMoeda(resumo.vendasHoje)}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4">
          <p className="text-xs text-red-700 dark:text-red-400 mb-1">Estoque baixo</p>
          <p className="text-xl font-medium text-red-700 dark:text-red-400">{resumo.alertasEstoqueBaixo} itens</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-3">Alertas de reposição</p>
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
              <tr key={produto.id} className="border-t border-neutral-100 dark:border-neutral-800">
                <td className="py-2 text-neutral-900 dark:text-neutral-100">{produto.nome}</td>
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
                <td colSpan={3} className="py-4 text-center text-neutral-400 dark:text-neutral-600">
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