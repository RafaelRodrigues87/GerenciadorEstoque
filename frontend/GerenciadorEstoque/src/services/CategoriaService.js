import api from '../api/client'


export const CategoriaService = {
    async listarTodos(){
        const {data} = await api.get('/categoria/listar')
        return data
    },

    async criar(categoria){
        const {data} = await api.post('/categorias/criar', categoria)
        return data
    },

    async atualizar(id, categoria){
        const { data } = await api.put('/categorias/atualizar/${id}', categoria)
        return data
    },

    async remove(id){
        await api.delete('/categorias/${id}')
    }
}