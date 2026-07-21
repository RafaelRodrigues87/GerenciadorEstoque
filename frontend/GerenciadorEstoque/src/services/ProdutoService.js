import api from '../api/client'

export const produtoService = {
    async listarTodos() {
        const {data} = await api.get('/produto/listar')
        return data
    },

    async buscarPorID(id) {
        const {data} = await api.get('/produtos/${id}')
        return data
    },

    async listarComEstoqueBaixo(){
        const {data} = await api.get('/produtos/estoque-baixo')
        return data
    },

    async criar(produto){
        const {data} = await api.post('/produtos/criar', produto)
        return data
    },

    async atualizar(id, produto){
        const {data} = await api.put(`/produtos/atualizar/${id}`, produto)
        return data
    },

    async ajustarEstoque(id, ajuste){
        const { data } = await api.put(`/produtos/ajusata-estoque/${id}`, ajuste)
        return data
    },

    async iantivar(id){
        await api.delete(`/produtos/${id}`)
    }
}