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

const btnFiltro = document.querySelector("#btn-filtro");

function mostrarErro(campo, elementoErro, mensagem) {
    campo.classList.add("is-invalid");
    elementoErro.innerText = mensagem;
}

function limparErros() {
    camposComErro.forEach(function (campo) {
        campo.classList.remove("is-invalid");
    });

    mensagensDeErro.forEach(function (elementoErro) {
        elementoErro.innerText = "";
    });
}


btnFiltro.addEventListener('click', function(event) {
    event.preventDefault();
    
    let validacao = true;

    const pesquisa = campoPesquisa.value;
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

    const prioridade = [
        critica,
        alta,
        media,
        baixa
    ];

    const tipo = [
        tarefa,
        defeito,
        melhoria,
        documentacao
    ];

    if (pesquisa.length > 0 && pesquisa.length < 3) {
        validacao = false;
        mostrarErro(campoPesquisa, erroPesquisa, "A pesquisa deve haver no mínimo 3 caractéres.");
    }
});

