import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function obterTemaInicial() {
  const salvo = localStorage.getItem('tema')
  if (salvo === 'claro' || salvo === 'escuro') {
    return salvo
  }
  // Se o usuário nunca escolheu, respeita a preferência do sistema operacional
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefereEscuro ? 'escuro' : 'claro'
}

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(obterTemaInicial)

  useEffect(() => {
    const raiz = document.documentElement
    if (tema === 'escuro') {
      raiz.classList.add('dark')
    } else {
      raiz.classList.remove('dark')
    }
    localStorage.setItem('tema', tema)
  }, [tema])

  function alternarTema() {
    setTema((atual) => (atual === 'claro' ? 'escuro' : 'claro'))
  }

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme precisa ser usado dentro de um ThemeProvider')
  }
  return context
}