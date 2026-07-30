import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ paginaAtual, totalPaginas, onMudarPagina }) {
  if (totalPaginas <= 1) return null

  const podeVoltar = paginaAtual > 0
  const podeAvancar = paginaAtual < totalPaginas - 1

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-neutral-800">
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        Página {paginaAtual + 1} de {totalPaginas}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => onMudarPagina(paginaAtual - 1)}
          disabled={!podeVoltar}
          className="flex items-center justify-center w-7 h-7 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onMudarPagina(paginaAtual + 1)}
          disabled={!podeAvancar}
          className="flex items-center justify-center w-7 h-7 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}