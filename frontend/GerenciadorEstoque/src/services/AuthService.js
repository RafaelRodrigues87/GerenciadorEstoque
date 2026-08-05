import api from '../api/client'

export const authService = {
  async login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha })
    return data
  },

  async esqueciSenha(email) {
    await api.post('/auth/esqueci-senha', { email })
  },

  async redefinirSenha(email, codigo, novaSenha) {
    await api.post('/auth/redefinir-senha', { email, codigo, novaSenha })
  },
}