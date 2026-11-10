
/*
    JS da tela de Dashboard

    Autor: Sophia Dalla Bernardina Lopes

    Arquivo responsável pela integração da tela de Dashboard com a API e pela atualização da tela com os dados
*/


const btn7Dias = document.querySelector("#btn7Dias");
const btn30Dias = document.querySelector("#btn30Dias");
const btn90Dias = document.querySelector("#btn90Dias");

const periodoDashboard = document.querySelector("#periodoDashboard");
const valorAbertas = document.querySelector("#valorAbertas");
const valorDesenvolvimento = document.querySelector("#valorDesenvolvimento");
const valorAnalise = document.querySelector("#valorAnalise");
const valorAderencia = document.querySelector("#valorAderencia");
const descricaoAbertas = document.querySelector("#descricaoAbertas");

const areaFluxo = document.querySelector("#graficoFluxo");
const areaDistribuicao = document.querySelector("#graficoDistribuicao");
const tabelaRecentes = document.querySelector("#tabelaRecentes");

const mensagemErro = document.querySelector("#mensagemErro");

const API_URL = "http://localhost:3000/dashboard";
let periodoSelecionado = 30;


function exibirErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.style.display = "block";
}

function limparErro() {
    mensagemErro.textContent = "";
    mensagemErro.style.display = "none";
}



function atualizarIndicadores(dados) {
    periodoDashboard.innerText = `Últimos ${dados.periodo} dias · ${dados.indicadores.ativas} demandas ativas`;
    valorAbertas.innerText = dados.indicadores.abertas;
    valorDesenvolvimento.innerText = dados.indicadores.desenvolvimento;
    valorAnalise.innerText = dados.indicadores.analise;
    valorAderencia.innerText = `${dados.indicadores.aderencia}%`;
    descricaoAbertas.innerText = `entraram nos últimos ${dados.periodo} dias`;
}


function atualizarFluxo(fluxo) {
    areaFluxo.replaceChildren();
    const maiorValor = Math.max(1, ...fluxo.map(item => Math.max(Number(item.ABERTAS), Number(item.CONCLUIDAS))));

    fluxo.forEach(item => {
        const semana = document.createElement("div");
        semana.className = "barra-semana";

        const titulo = document.createElement("strong");
        titulo.textContent = item.SEMANA;

        const abertas = document.createElement("div");
        abertas.className = "barra abertas";

        abertas.style.width = `${(Number(item.ABERTAS) / maiorValor) * 100}%`;
        abertas.textContent = item.ABERTAS;

        const concluidas = document.createElement("div");
        concluidas.className = "barra concluidas";
        concluidas.style.width = `${(Number(item.CONCLUIDAS) / maiorValor) * 100}%`;
        concluidas.textContent = item.CONCLUIDAS;

        semana.append(titulo, abertas, concluidas);
        areaFluxo.appendChild(semana);
    });
}


function atualizarDistribuicao(distribuicao) {
    areaDistribuicao.replaceChildren();

    const cores = {
        "Aberta": "#64748b",
        "Em andamento": "#3b82f6",
        "Em revisao": "#f59e0b",
        "Concluida": "#10b981",
        "Cancelada": "#ef4444"
    };

    const nomes = {
        "Aberta": "Aberta",
        "Em andamento": "Em andamento",
        "Em revisao": "Em revisão",
        "Concluida": "Concluída",
        "Cancelada": "Cancelada"
    };

    if (distribuicao.length === 0) {
        areaDistribuicao.textContent = "Nenhuma demanda cadastrada.";
        return;
    }

    const total = distribuicao.reduce((soma, item) => soma + Number(item.TOTAL), 0);

    distribuicao.forEach(item => {
        const linha = document.createElement("div");
        linha.className = "distribuicao-item";

        const titulo = document.createElement("span");
        titulo.textContent = nomes[item.STATUS] || item.STATUS;

        const quantidade = document.createElement("strong");
        quantidade.textContent = item.TOTAL;

        const barraFundo = document.createElement("div");
        barraFundo.className = "barra-fundo";

        const barra = document.createElement("div");
        barra.className = "barra-status";

        barra.style.width = `${(Number(item.TOTAL) / total) * 100}%`;
        barra.style.backgroundColor = cores[item.STATUS] || "#64748b";
        barraFundo.appendChild(barra);

        linha.append(titulo, quantidade, barraFundo);
        areaDistribuicao.appendChild(linha);
    });
}


function atualizarRecentes(recentes) {
    tabelaRecentes.replaceChildren();
    if (recentes.length === 0) {
        const linha = document.createElement("tr");
        const coluna = document.createElement("td");

        coluna.colSpan = 5;
        coluna.textContent = "Nenhuma demanda encontrada.";

        linha.appendChild(coluna);
        tabelaRecentes.appendChild(linha);

        return;
    }

    recentes.forEach(demanda => {
        const linha = document.createElement("tr");
        const dados = [
            `#${String(demanda.ID_DEMANDA).padStart(2, "0")}`,
            demanda.TITULO,
            demanda.RESPONSAVEL,
            demanda.STATUS,
            demanda.PRIORIDADE
        ];

        dados.forEach(valor => {
            const coluna = document.createElement("td");
            coluna.textContent = valor ?? "-";
            linha.appendChild(coluna);
        });

        tabelaRecentes.appendChild(linha);
    });
}


// Busca dados da api
async function carregarDashboard(periodo = 30) {
    limparErro();
    periodoSelecionado = periodo;
    try {
        // Realiza a requisição para o backend.
        const resposta = await fetch(`${API_URL}?periodo=${periodo}`);


        const dados = await resposta.json();
        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao carregar o Dashboard.");
        }

        // Atualiza todos os elementos da tela.
        atualizarIndicadores(dados);
        atualizarFluxo(dados.fluxo);
        atualizarDistribuicao(dados.distribuicao);
        atualizarRecentes(dados.recentes);
    } catch (erro) {
        console.error("Erro no Dashboard:", erro);
        exibirErro(erro.message === "Failed to fetch" ? "Não foi possível conectar à API. Verifique se o servidor está ativo." : erro.message);
    }
}

function limparSelecao() {
    btn7Dias.classList.remove("selected");
    btn30Dias.classList.remove("selected");
    btn90Dias.classList.remove("selected");
}


// Carrega os dados ao selecionar 7 dias.
btn7Dias.addEventListener("click", function () {
    limparSelecao();
    btn7Dias.classList.add("selected");
    carregarDashboard(7);
});


// Carrega os dados ao selecionar 30 dias.
btn30Dias.addEventListener("click", function () {
    limparSelecao();
    btn30Dias.classList.add("selected");
    carregarDashboard(30);
});


// Carrega os dados ao selecionar 90 dias.
btn90Dias.addEventListener("click", function () {
    limparSelecao();
    btn90Dias.classList.add("selected");
    carregarDashboard(90);
});

// Carregamento inicial do Dashboard
carregarDashboard(periodoSelecionado);
