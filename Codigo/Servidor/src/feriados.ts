/*
    Verificação de feriados nacionais usando uma API externa (BrasilAPI)

    Autor: Pedro Tafner

    O Documento de Visão (item 2.2.5) obriga a usar uma API externa para impedir
    que o prazo de finalização de uma demanda caia em um feriado nacional.
    Este arquivo fica separado das rotas para poder ser usado tanto no cadastro
    (POST /demandas) quanto na edição da demanda.
*/

// Endereço da API pública de feriados nacionais (o ano vai no final: .../feriados/v1/2026)
const URL_FERIADOS = "https://brasilapi.com.br/api/feriados/v1";

// Tempo máximo esperando a resposta da API externa (em milissegundos)
const TEMPO_LIMITE = 8000;

// Formato de cada feriado devolvido pela BrasilAPI
interface FeriadoApi {
    date: string;  // data no formato AAAA-MM-DD
    name: string;  // nome do feriado (ex: "Natal")
    type: string;  // "national" para feriados nacionais
}

// Guarda os feriados já consultados de cada ano, para não chamar a API externa toda hora
// (ex: { 2026: [ ...feriados de 2026 ] })
const feriadosPorAno: { [ano: number]: FeriadoApi[] } = {};

// Erro lançado quando não foi possível consultar a API externa
// (a rota usa isso para avisar o usuário em vez de deixar passar uma data sem verificar)
export class ErroApiFeriados extends Error {}

// Busca na BrasilAPI a lista de feriados nacionais de um ano
async function buscarFeriadosDoAno(ano: number): Promise<FeriadoApi[]> {
    // Se esse ano já foi consultado antes, usa a lista guardada
    if (feriadosPorAno[ano]) {
        return feriadosPorAno[ano];
    }

    let resposta;

    try {
        // AbortSignal.timeout cancela a requisição se a API demorar demais
        resposta = await fetch(`${URL_FERIADOS}/${ano}`, { signal: AbortSignal.timeout(TEMPO_LIMITE) });
    } catch (erro) {
        throw new ErroApiFeriados("Não foi possível conectar à API de feriados.");
    }

    if (!resposta.ok) {
        throw new ErroApiFeriados(`A API de feriados respondeu com erro (status ${resposta.status}).`);
    }

    const lista = (await resposta.json()) as FeriadoApi[];

    // Fica só com os feriados nacionais
    const nacionais = lista.filter((feriado) => feriado.type === "national");

    feriadosPorAno[ano] = nacionais;

    return nacionais;
}

// Verifica se a data (AAAA-MM-DD) é feriado nacional
// Devolve o nome do feriado (ex: "Natal") ou null se não for feriado
// Se a API externa não responder, lança ErroApiFeriados
export async function buscarFeriado(data: string): Promise<string | null> {
    const ano = Number(data.substring(0, 4));

    const feriados = await buscarFeriadosDoAno(ano);

    const feriado = feriados.find((item) => item.date === data);

    return feriado ? feriado.name : null;
}
