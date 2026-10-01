// Função para buscar os registros no servidor
export async function carregarDadosDoBanco() {
  try {
    const resposta = await fetch('/api/alteracoes');
    if (!resposta.ok) {
      throw new Error('Erro ao buscar dados do servidor');
    }
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error('Erro ao carregar dados do D1:', erro);
    return [];
  }
}

// Função para enviar novos registros para o servidor
export async function salvarDadosNoBanco(autor, conteudo) {
  try {
    const resposta = await fetch('/api/alteracoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ autor, conteudo })
    });

    if (!resposta.ok) {
      throw new Error('Erro ao salvar no servidor');
    }

    const resultado = await resposta.json();
    return resultado;
  } catch (erro) {
    console.error('Erro ao salvar no D1:', erro);
  }
}