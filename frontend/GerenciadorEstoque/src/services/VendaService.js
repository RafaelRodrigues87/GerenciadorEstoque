import api from '../api/client'

export const vendaService = {
  async listarPaginado({ pagina = 0, tamanho = 20, status } = {}) {
    const { data } = await api.get('/vendas/listar', {
      params: { page: pagina, size: tamanho, status },
    })
    return data // { content, totalElements, totalPages, number, ... }
  },

  async buscarPorId(id) {
    const { data } = await api.get(`/vendas/${id}`)
    return data
  },

  async criar(venda) {
    const { data } = await api.post('/vendas/criar', venda)
    return data
  },

  async cancelar(id) {
    const { data } = await api.patch(`/vendas/cancelar/${id}`)
    return data
  },
}