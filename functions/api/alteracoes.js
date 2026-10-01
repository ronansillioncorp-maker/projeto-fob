export async function onRequestGet(context) {
  try {
    if (!context.env || !context.env.DB) {
      return new Response(
        JSON.stringify({ error: "Conexão com o banco D1 não encontrada. Verifique o binding DB." }), 
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }

    const { results } = await context.env.DB.prepare(
      "SELECT * FROM alteracoes ORDER BY criado_em DESC"
    ).all();

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (erro) {
    return new Response(
      JSON.stringify({ error: "Erro ao buscar dados do D1", details: erro.message }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestPost(context) {
  try {
    if (!context.env || !context.env.DB) {
      return new Response(
        JSON.stringify({ error: "Conexão com o banco D1 não configurada." }), 
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await context.request.json();
    const { autor, conteudo } = body;

    if (!autor || !conteudo) {
      return new Response(
        JSON.stringify({ error: "Campos 'autor' e 'conteudo' são obrigatórios." }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await context.env.DB.prepare(
      "INSERT INTO alteracoes (autor, conteudo, criado_em) VALUES (?, ?, DATETIME('now'))"
    ).bind(autor, conteudo).run();

    return new Response(
      JSON.stringify({ status: "success", message: "Registro salvo com sucesso no D1!" }), 
      { status: 201, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (erro) {
    return new Response(
      JSON.stringify({ error: "Erro ao salvar no banco D1", details: erro.message }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}