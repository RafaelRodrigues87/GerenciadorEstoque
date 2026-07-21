import api from '../api/client'

export const VendaService = {

    async listarTodas(){
        const {data} = await api.get('/vendas/listar')
        return data
},
    async buscarPorId(id){
        const {data} = await api.get(`/vendas/${id}`)
        return data
    },

    async criar(venda){
        const {data} = await api.post('/vendas/criar', venda)
        return data
    }

}