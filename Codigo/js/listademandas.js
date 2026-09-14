// Lista de Demandas - João Felipe Bodo Pinheiro

const campoPesquisa = document.querySelector("#pesquisa");
const aberto = document.querySelector("#fs-aberta");
const andamento = document.querySelector("#fs-andamento");
const revisao = document.querySelector("#fs-revisao");
const concluida = document.querySelector("#fs-concluida");
const cancelada = document.querySelector("#fs-cancelada");
const critica = document.querySelector("#fp-critica");
const alta = document.querySelector("#fp-alta");
const media = document.querySelector("#fp-media");
const baixa = document.querySelector("#fp-baixa");
const tarefa = document.querySelector("#ft-tarefa");
const defeito = document.querySelector("#ft-defeito");
const melhoria = document.querySelector("#ft-melhoria");
const documentacao = document.querySelector("#ft-documentacao");

const btnFiltro = document.querySelector("#btn-filtro");

const filtro = [
    aberto.checked,
    andamento.checked,
    revisao.checked,
    concluida.checked,
    cancelada.checked,

    critica.checked,
    alta.checked,
    media.checked,
    baixa.checked,

    tarefa.checked,
    defeito.checked,
    melhoria.checked,
    documentacao.checked
]

btnFiltro.addEventListener('click', function(event) {
    event.preventDefault();
    alert('teste de funcionamento do botao!');
});