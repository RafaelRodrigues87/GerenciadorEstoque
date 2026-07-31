import { useEffect, useState } from 'react'
import { Plus, Pencil, UserX, UserCheck } from 'lucide-react'
import { usuarioService } from '../services/usuarioService'
import { useAuth } from '../auth/AuthContext'
import UsuarioFormModal from '../components/usuarios/UsuarioFormModal'

export default function Usuarios() {
  const { usuario } = useAuth()
  const ehAdmin = usuario?.papel === 'ADMIN'

  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroGeral, setErroGeral] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState(null)

  async function carregar() {
    setCarregando(true)
    const dados = await usuarioService.listarTodos()
    setUsuarios(dados)
    setCarregando(false)
  }

  useEffect(() => {
    carregar()
  }, [])

  function abrirParaCriar() {
    setUsuarioEmEdicao(null)
    setErroGeral('')
    setModalAberto(true)
  }

  function abrirParaEditar(usuario) {
    setUsuarioEmEdicao(usuario)
    setErroGeral('')
    setModalAberto(true)
  }

  async function handleSalvar(dados) {
    if (usuarioEmEdicao) {
      await usuarioService.atualizar(usuarioEmEdicao.id, dados)
    } else {
      await usuarioService.criar(dados)
    }
    setModalAberto(false)
    await carregar()
  }

  async function handleAlternarStatus(usuario) {
    try {
      if (usuario.ativo) {
        await usuarioService.inativar(usuario.id)
      } else {
        await usuarioService.reativar(usuario.id)
      }
      await carregar()
    } catch (err) {
      setErroGeral(err.response?.data?.mensagem ?? 'Não foi possível alterar o status deste usuário')
    }
  }

  const rotulosPapel = { ADMIN: 'Admin', OPERADOR: 'Operador' }

  if (!ehAdmin) {
    return (
      <div className="p-6">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-1">Usuários</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Quem tem acesso ao sistema
          </p>
        </div>
        <button
          onClick={abrirParaCriar}
          className="flex items-center gap-1.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <Plus size={16} />
          Novo usuário
        </button>
      </div>

      {erroGeral && (
        <div className="mb-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
          {erroGeral}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 dark:text-neutral-400 text-left">
              <th className="font-medium px-4 py-3">Nome</th>
              <th className="font-medium px-4 py-3">E-mail</th>
              <th className="font-medium px-4 py-3 text-center">Papel</th>
              <th className="font-medium px-4 py-3 text-center">Status</th>
              <th className="font-medium px-4 py-3 w-24 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                  Carregando...
                </td>
              </tr>
            )}

            {!carregando && usuarios.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                  Nenhum usuário cadastrado
                </td>
              </tr>
            )}

            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="border-t border-neutral-100 dark:border-neutral-800">
                <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">{usuario.nome}</td>
                <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{usuario.email}</td>
                <td className="px-4 py-3 text-center text-neutral-500 dark:text-neutral-400">
                  {rotulosPapel[usuario.papel]}
                </td>
                <td className="px-4 py-3 text-center">
                  {usuario.ativo ? (
                    <span className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-medium px-2.5 py-1 rounded-md">
                      Ativo
                    </span>
                  ) : (
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-medium px-2.5 py-1 rounded-md">
                      Inativo
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => abrirParaEditar(usuario)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Editar"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleAlternarStatus(usuario)}
                      className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title={usuario.ativo ? 'Inativar' : 'Reativar'}
                    >
                      {usuario.ativo ? <UserX size={15} /> : <UserCheck size={15} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <UsuarioFormModal
          usuarioEmEdicao={usuarioEmEdicao}
          onFechar={() => setModalAberto(false)}
          onSalvar={handleSalvar}
        />
      )}
    </div>
  )
}