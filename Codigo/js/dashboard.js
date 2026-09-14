/*
    AUTORIA: Sophia D B Lopes
    TELA: Dashboard

    Arquivo responsável pelos comportamentos da tela
    de Dashboard utilizando JavaScript e DOM.
*/

// botões de período
const btn7Dias = document.querySelector("#btn7Dias");
const btn30Dias = document.querySelector("#btn30Dias");
const btn90Dias = document.querySelector("#btn90Dias");


const periodoDashboard = document.querySelector("#periodoDashboard");
const valorAbertas = document.querySelector("#valorAbertas");
const valorDesenvolvimento = document.querySelector("#valorDesenvolvimento");
const valorAnalise = document.querySelector("#valorAnalise");
const valorAderencia = document.querySelector("#valorAderencia");
const descricaoAbertas = document.querySelector("#descricaoAbertas");

const dados7Dias = {
    periodo: "Últimos 7 dias",
    ativas: 4,
    abertas: 5,
    desenvolvimento: 3,
    analise: 2,
    aderencia: "96%"
};

const dados30Dias = {
    periodo: "Últimos 30 dias",
    ativas: 4,
    abertas: 12,
    desenvolvimento: 8,
    analise: 5,
    aderencia: "92%"
};

const dados90Dias = {
    periodo: "Últimos 90 dias",
    ativas: 4,
    abertas: 31,
    desenvolvimento: 15,
    analise: 9,
    aderencia: "88%"
};

function limparSelecao() {
    btn7Dias.classList.remove("selected");
    btn30Dias.classList.remove("selected");
    btn90Dias.classList.remove("selected");
}


/* Atualiza os elementos do Dashboard */
function atualizarDashboard(dados) {
    periodoDashboard.innerText = dados.periodo + " · " + dados.ativas + " demandas ativas";
    valorAbertas.innerText = dados.abertas;
    valorDesenvolvimento.innerText = dados.desenvolvimento;
    valorAnalise.innerText = dados.analise;
    valorAderencia.innerText = dados.aderencia;

    descricaoAbertas.innerText = "entraram nos " + dados.periodo.toLowerCase();
    const json = JSON.stringify(dados, null, 2);

    console.log(json);
}


/* evento executado quando seleciona 7 dias */
btn7Dias.addEventListener("click", function () {
    limparSelecao();
    btn7Dias.classList.add("selected");
    atualizarDashboard(dados7Dias);
});

/* evento executado quando seleciona 30 dias */
btn30Dias.addEventListener("click", function () {
    limparSelecao();
    btn30Dias.classList.add("selected");
    atualizarDashboard(dados30Dias);
});

/* evento executado quando seleciona 90 dias */
btn90Dias.addEventListener("click", function () {
    limparSelecao();
    btn90Dias.classList.add("selected");
    atualizarDashboard(dados90Dias);
});