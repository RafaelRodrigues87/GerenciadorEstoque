import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Tag, History } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import ThemeToggle from './ThemeToggle'

const itensMenu = [
  { rota: '/', rotulo: 'Painel', Icone: LayoutDashboard },
  { rota: '/produtos', rotulo: 'Produtos', Icone: Package },
  { rota: '/vendas', rotulo: 'Vendas', Icone: ShoppingCart },
  { rota: '/categorias', rotulo: 'Categorias', Icone: Tag },
  { rota: '/movimentacoes', rotulo: 'Movimentações', Icone: History },
]

export default function Sidebar() {
  const { usuario, logout } = useAuth()

  const iniciais = usuario?.nome
    ?.split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()

  return (
    <aside className="w-52 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between py-5">
      <div>
        <div className="flex items-center justify-between px-5 mb-7">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center">
              <Package size={14} className="text-white dark:text-neutral-900" />
            </div>
            <span className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
              EstoqueFácil
            </span>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex flex-col gap-0.5 px-2.5">
          {itensMenu.map(({ rota, rotulo, Icone }) => (
            <NavLink
              key={rota}
              to={rota}
              end={rota === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm ${
                  isActive
                    ? 'bg-white dark:bg-neutral-800 font-medium text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-white/60 dark:hover:bg-neutral-800/60'
                }`
              }
            >
              <Icone size={17} />
              {rotulo}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[11px] font-medium text-blue-800 dark:text-blue-200">
            {iniciais}
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
              {usuario?.nome}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              {usuario?.papel}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}