import { Routes, Route } from 'react-router-dom'
import { RotaPrivada } from '../auth/RotaPrivada'
import AppLayout from '../components/layout/AppLayout'
import Login from '../page/Login'
import Dashboard from '../page/Dashboard'
import Categorias from '../page/Categorias'
import Produtos from '../page/Produtos'
import Vendas from '../page/Vendas'
import Movimentacoes from '../page/Movimentacoes'
import Usuarios from '../page/Usuarios'
import MeuPerfil from '../page/MeuPerfil'
import EsqueciSenha from '../page/EsqueciSenha'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="esqueciSenha" element={<EsqueciSenha />} />
      <Route
        element={
          <RotaPrivada>
            <AppLayout />
          </RotaPrivada>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="produtos" element={<Produtos />} />
        <Route path="vendas" element={<Vendas />} />
        <Route path="movimentacoes" element={<Movimentacoes />} />
       
        //rota que expoe as contas dos funcionarios
        <Route
          path="usuarios"
          element={
            <RotaPrivada permissoes={['ADMIN']}>
              <Usuarios />
            </RotaPrivada>
          }
        />
        <Route path="meuPerfil" element={<MeuPerfil />} />
      </Route>
    </Routes>
  )
}