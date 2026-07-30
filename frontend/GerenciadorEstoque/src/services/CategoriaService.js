import api from '../api/client'


export const CategoriaService = {
    async listarTodos(){
        const {data} = await api.get('/categoria/listar')
        return data
    },

    async criar(categoria){
        const {data} = await api.post(`categoria/criar`, categoria)
        return data
    },

    async atualizar(id, categoria){
        const { data } = await api.put(`/categoria/atualizar/${id}`, categoria)
        return data
    },

    async remover(id){
        await api.delete(`/categoria/${id}`)
    }
}