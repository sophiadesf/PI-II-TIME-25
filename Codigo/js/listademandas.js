// Lista de Demandas - João Felipe Bodo Pinheiro

const campoPesquisa = document.querySelector("#pesquisa");
const checkboxAberto = document.querySelector("#fs-aberta");
const checkboxAndamento = document.querySelector("#fs-andamento");
const checkboxRevisao = document.querySelector("#fs-revisao");
const checkboxConcluida = document.querySelector("#fs-concluida");
const checkboxCancelada = document.querySelector("#fs-cancelada");
const checkboxCritica = document.querySelector("#fp-critica");
const checkboxAlta = document.querySelector("#fp-alta");
const checkboxMedia = document.querySelector("#fp-media");
const checkboxBaixa = document.querySelector("#fp-baixa");
const checkboxTarefa = document.querySelector("#ft-tarefa");
const checkboxDefeito = document.querySelector("#ft-defeito");
const checkboxMelhoria = document.querySelector("#ft-melhoria");
const checkboxDocumentacao = document.querySelector("#ft-documentacao");

const erroPesquisa = document.querySelector("#erroPesquisa");
const erroFiltro = document.querySelector("#erroFiltro");

const btnFiltro = document.querySelector("#btn-filtro");

const camposComErro = [
    campoPesquisa,
    btnFiltro
];

const mensagemErro = [
    erroPesquisa,
    erroFiltro
];

function mostrarErro(campo, elementoErro, mensagem) {
    campo.classList.add("is-invalid");
    elementoErro.innerText = mensagem;
}

function limparErros() {
    camposComErro.forEach(function (campo) {
        campo.classList.remove("is-invalid");
    });

    mensagemErro.forEach(function (elementoErro) {
        elementoErro.innerText = "";
    });
}

btnFiltro.addEventListener('click', function(event) {
    event.preventDefault();

    limparErros();
    
    let validacao = true;
    let cont = 0;

    const pesquisa = campoPesquisa.value.trim();

    const aberto = checkboxAberto.checked;
    const andamento = checkboxAndamento.checked;
    const revisao = checkboxRevisao.checked;
    const concluida = checkboxConcluida.checked;
    const cancelada = checkboxCancelada.checked;
    const critica = checkboxCritica.checked;
    const alta = checkboxAlta.checked;
    const media = checkboxMedia.checked;
    const baixa = checkboxBaixa.checked;
    const tarefa = checkboxTarefa.checked;
    const defeito = checkboxDefeito.checked;
    const melhoria = checkboxMelhoria.checked;
    const documentacao = checkboxDocumentacao.checked;

    const status = [
        aberto,
        andamento,
        revisao,
        concluida,
        cancelada
    ];

    for (let i=0; i<5; i++) {
        if (status[i]){
            cont++;
        }
    }

    const prioridade = [
        critica,
        alta,
        media,
        baixa
    ];

    for (let i=0; i<4; i++) {
        if (prioridade[i]){
            cont++;
        }
    }

    const tipo = [
        tarefa,
        defeito,
        melhoria,
        documentacao
    ];

    for (let i=0; i<4; i++) {
        if (tipo[i]){
            cont++;
        }
    }

    if (cont === 1){
        validacao = false;
        mostrarErro(btnFiltro, erroFiltro, "Selecione no mínimo 2 filtros.");
    }

    if (pesquisa.length > 0 && pesquisa.length < 3) {
        validacao = false;
        mostrarErro(campoPesquisa, erroPesquisa, "A pesquisa deve haver no mínimo 3 caractéres.");
    }
});

