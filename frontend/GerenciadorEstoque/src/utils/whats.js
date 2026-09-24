export function gerarLinkWhatsAppEstoqueBaixo(produtos) {
  const dataFormatada = new Date().toLocaleDateString('pt-BR')
 
  const linhas = produtos.map(
    (produto) => `• ${produto.nome}: ${produto.quantidadeAtual} (mín. ${produto.quantidadeMinima})`
  )
 
  const mensagem = [
    ` *Produtos com estoque baixo* — ${dataFormatada}`,
    '',
    ...linhas,
    '',
    `Total: ${produtos.length} ${produtos.length === 1 ? 'produto precisa' : 'produtos precisam'} de reposição.`,
  ].join('\n')
 
  return `https://wa.me/?text=${encodeURIComponent(mensagem)}`
}
 