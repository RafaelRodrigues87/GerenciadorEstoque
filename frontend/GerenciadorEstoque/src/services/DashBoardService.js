import api from '../api/client'

export const dashboardService = {
    async buscarResumo(){
        const {data} = await api.get('/dashboard/resumo')
        return data
    }
}