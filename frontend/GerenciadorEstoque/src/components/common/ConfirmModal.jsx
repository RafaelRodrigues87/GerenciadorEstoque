import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmModal({
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  confirmando = false,
  onConfirmar,
  onFechar,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950 flex items-center justify-center shrink-0">
              <AlertTriangle size={17} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-base font-medium text-neutral-900 dark:text-neutral-100">
              {titulo}
            </h2>
          </div>
          <button onClick={onFechar} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">{mensagem}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onFechar}
            className="flex-1 text-sm font-medium py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={confirmando}
            className="flex-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
          >
            {confirmando ? 'Aguarde...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}