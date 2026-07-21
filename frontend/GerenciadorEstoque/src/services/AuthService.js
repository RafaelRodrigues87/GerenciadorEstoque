import api from '../api/client'

export const authService = {
    async login(email, senha) {
        const {data} = await api.post('/auth/login', {email, senha})
        return data
    },
}