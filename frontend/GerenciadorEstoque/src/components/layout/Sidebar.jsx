import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Tag, History } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'

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
    <aside className="w-52 bg-neutral-50 border-r border-neutral-200 flex flex-col justify-between py-5">
      <div>
        <div className="flex items-center gap-2 px-5 mb-7">
          <div className="w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center">
            <Package size={14} className="text-white" />
          </div>
          <span className="font-medium text-sm text-neutral-900">EstoqueFácil</span>
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
                    ? 'bg-white font-medium text-neutral-900'
                    : 'text-neutral-500 hover:bg-white/60'
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
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-medium text-blue-800">
            {iniciais}
          </div>
          <div className="leading-tight">
            <p className="text-xs font-medium text-neutral-900">{usuario?.nome}</p>
            <p className="text-[11px] text-neutral-400">{usuario?.papel}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-xs text-neutral-500 hover:text-neutral-900"
        >
          Sair
        </button>
      </div>
    </aside>
  )
}