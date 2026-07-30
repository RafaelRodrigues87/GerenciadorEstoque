const CORES = [
  '#2563EB', // Azul
  '#DC2626', // Vermelho
  '#16A34A', // Verde
  '#CA8A04', // Amarelo
  '#9333EA', // Roxo
  '#EA580C', // Laranja
  '#0891B2', // Ciano
  '#DB2777', // Rosa
  '#4F46E5', // Índigo
  '#65A30D', // Verde-lima
  '#B91C1C', // Vermelho escuro
  '#0F766E', // Turquesa
  '#7C3AED', // Violeta
  '#C2410C', // Laranja escuro
  '#1D4ED8', // Azul escuro
  '#BE123C', // Magenta
  '#15803D', // Verde escuro
  '#A16207', // Dourado
  '#0369A1', // Azul petróleo
  '#7E22CE', // Roxo escuro
  '#0EA5E9', // Azul claro
  '#84CC16', // Lima
  '#F97316', // Laranja claro
  '#14B8A6', // Verde água
  '#6366F1', // Índigo claro
  '#E11D48', // Rosa escuro
  '#F59E0B', // Âmbar
  '#06B6D4', // Ciano claro
  '#8B5CF6', // Roxo claro
  '#22C55E', // Verde claro
]

export function corCategoria(nome) {
  let hash = 0

  for (let i = 0; i < nome.length; i++) {
    hash = (hash * 31 + nome.charCodeAt(i)) >>> 0
  }

  return CORES[hash % CORES.length]
}