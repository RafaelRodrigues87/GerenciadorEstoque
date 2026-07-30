import { Routes, Route } from 'react-router-dom'
import { RotaPrivada } from '../auth/RotaPrivada'
import AppLayout from '../components/layout/AppLayout'
import Login from '../page/Login'
import Dashboard from '../page/Dashboard'
import Categorias from '../page/Categorias'
import Produtos from '../page/Produtos'
import Vendas from '../page/Vendas'
import Movimentacoes from '../page/Movimentacoes'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RotaPrivada>
            <AppLayout />
          </RotaPrivada>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="categorias" element={<Categorias/>}/>
        <Route path="produtos" element={<Produtos/>}/>
        <Route path="vendas" element={<Vendas/>}/>
        <Route path="Movimentacoes" element={<Movimentacoes/>}/>
        {/* Próximas rotas entram aqui dentro, conforme as páginas forem criadas:
            <Route path="produtos" element={<Produtos />} />
            <Route path="vendas" element={<Vendas />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="movimentacoes" element={<Movimentacoes />} /> */}
      </Route>
    </Routes>
  )
}