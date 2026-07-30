import api from '../api/client'

export const movimentacaoService = {
  async listarTodas() {
    const { data } = await api.get('/movimentacoes/listar')
    return data
  },

  async listarPorProduto(produtoId) {
    const { data } = await api.get(`/movimentacoes/produto/${produtoId}`)
    return data
  },
}