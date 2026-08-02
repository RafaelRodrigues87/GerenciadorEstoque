import api from '../api/client'

export const usuarioService = {
  async listarTodos() {
    const { data } = await api.get('/usuarios/listar')
    return data
  },

  async criar(usuario) {
    const { data } = await api.post('/usuarios/criar', usuario)
    return data
  },

  async atualizar(id, usuario) {
    const { data } = await api.patch(`/usuarios/atualizar/funcionario/${id}`, usuario)
    return data
  },

  async inativar(id) {
    await api.patch(`/usuarios/inativar/${id}`)
  },

  async reativar(id) {
    await api.patch(`/usuarios/reativar/${id}`)
  },

  async buscarMeuPerfil() {
    const { data } = await api.get('/usuarios/meu-perfil')
    return data
  },

  async atualizarMeuPerfil(dados) {
    const { data } = await api.put('/usuarios/meu-perfil', dados)
    return data
  },

  async alterarSenha(dados) {
    await api.patch('/usuarios/alterar-senha', dados)
  },
}