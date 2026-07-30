import { X } from 'lucide-react'

const rotulosFormaPagamento = {
  DINHEIRO: 'Dinheiro',
  PIX: 'Pix',
  CARTAO_CREDITO: 'Cartão de crédito',
  CARTAO_DEBITO: 'Cartão de débito',
}

export default function VendaDetalhesModal({ venda, onFechar }) {
  const formatarMoeda = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const formatarData = (data) =>
    new Date(data).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            Venda #{venda.id}
          </h2>
          <button
            onClick={onFechar}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
          {formatarData(venda.dataHora)} · {venda.usuarioNome} · {rotulosFormaPagamento[venda.formaPagamento]}
        </p>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-neutral-500 dark:text-neutral-400 text-left border-b border-neutral-200 dark:border-neutral-800">
                <th className="font-normal px-3 py-2">Produto</th>
                <th className="font-normal px-3 py-2 text-center">Qtd.</th>
                <th className="font-normal px-3 py-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {venda.itens.map((item, indice) => (
                <tr
                  key={indice}
                  className="border-b last:border-0 border-neutral-100 dark:border-neutral-800"
                >
                  <td className="px-3 py-2 text-neutral-900 dark:text-neutral-100">
                    {item.produtoNome}
                  </td>
                  <td className="px-3 py-2 text-center text-neutral-500 dark:text-neutral-400">
                    x{item.quantidade}
                  </td>
                  <td className="px-3 py-2 text-right text-neutral-900 dark:text-neutral-100">
                    {formatarMoeda(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Total</span>
          <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            {formatarMoeda(venda.valorTotal)}
          </span>
        </div>

        <button
          onClick={onFechar}
          className="w-full text-sm font-medium py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}