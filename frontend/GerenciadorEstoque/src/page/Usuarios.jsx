import { useEffect, useState } from 'react'
import { Plus, Pencil, UserX, UserCheck, Users } from 'lucide-react'
import { usuarioService } from '../services/usuarioService'
import { useAuth } from '../auth/AuthContext'
import UsuarioFormModal from '../components/usuarios/UsuarioFormModal'

const coresAvatar = [
  'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
  'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
  'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
  'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200',
]

function obterIniciais(nome) {
  return nome
    ?.split(' ')
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase()
}

function obterCorAvatar(id) {
  return coresAvatar[id % coresAvatar.length]
}

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

  function abrirParaEditar(usuarioAlvo) {
    setUsuarioEmEdicao(usuarioAlvo)
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

  async function handleAlternarStatus(usuarioAlvo) {
    try {
      if (usuarioAlvo.ativo) {
        await usuarioService.inativar(usuarioAlvo.id)
      } else {
        await usuarioService.reativar(usuarioAlvo.id)
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

      {carregando && (
        <p className="text-sm text-neutral-400 text-center py-10">Carregando...</p>
      )}

      {!carregando && usuarios.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <Users size={28} className="mb-2 opacity-50" />
          <p className="text-sm">Nenhum usuário cadastrado</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {usuarios.map((usuarioItem) => (
          <div
            key={usuarioItem.id}
            className={`group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all ${
              !usuarioItem.ativo ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${obterCorAvatar(usuarioItem.id)}`}
                >
                  {obterIniciais(usuarioItem.nome)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                    {usuarioItem.nome}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {usuarioItem.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => abrirParaEditar(usuarioItem)}
                  className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Editar"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleAlternarStatus(usuarioItem)}
                  className="p-1.5 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title={usuarioItem.ativo ? 'Inativar' : 'Reativar'}
                >
                  {usuarioItem.ativo ? <UserX size={14} /> : <UserCheck size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                {rotulosPapel[usuarioItem.papel]}
              </span>
              {usuarioItem.ativo ? (
                <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-md">
                  Ativo
                </span>
              ) : (
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md">
                  Inativo
                </span>
              )}
            </div>
          </div>
        ))}
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