import api from '../api/client'

export const dashboardService = {
  async buscarResumo() {
    const { data } = await api.get('/dashboard/resumo')
    return data
  },

  async buscarVendasPorDia(dias = 7) {
    const { data } = await api.get('/dashboard/vendas-por-dia', { params: { dias } })
    return data
  },
}