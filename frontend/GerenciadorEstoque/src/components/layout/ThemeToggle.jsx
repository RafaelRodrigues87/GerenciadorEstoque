import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../theme/ThemeContext'

export default function ThemeToggle() {
  const { tema, alternarTema } = useTheme()

  return (
    <button
      onClick={alternarTema}
      title={tema === 'claro' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      className="flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:text-neutral-400"
    >
      {tema === 'claro' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}