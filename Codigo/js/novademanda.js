/**
 * Js para validação do formulário de Cadastro de Demandas
 * 
 * Autor: Pedro Tafner
 * 
 */
const formulario = document.querySelector("#formDemanda");

const campoTitulo = document.querySelector("#titulo");
const campoDescricao = document.querySelector("#descricao");
const campoTipo = document.querySelector("#tipo");
const campoPrioridade = document.querySelector("#prioridade");
const campoProjeto = document.querySelector("#projeto");
const campoResponsavel = document.querySelector("#responsavel");
const campoPrazo = document.querySelector("#prazo");


const erroTitulo = document.querySelector("#erroTitulo");
const erroDescricao = document.querySelector("#erroDescricao");
const erroTipo = document.querySelector("#erroTipo");
const erroPrioridade = document.querySelector("#erroPrioridade");
const erroProjeto = document.querySelector("#erroProjeto");
const erroResponsavel = document.querySelector("#erroResponsavel");
const erroPrazo = document.querySelector("#erroPrazo");


const painelResultado = document.querySelector("#painelResultado");
const resultado = document.querySelector("#resultado");

const camposComErro = [
    campoTitulo,
    campoDescricao,
    campoTipo,
    campoPrioridade,
    campoProjeto,
    campoResponsavel,
    campoPrazo
];

const mensagensDeErro = [
    erroTitulo,
    erroDescricao,
    erroTipo,
    erroPrioridade,
    erroProjeto,
    erroResponsavel,
    erroPrazo
];

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




formulario.addEventListener("submit", function(event){
    event.preventDefault();
    limparErros();

    const titulo = campoTitulo.value.trim();
    const descricao = campoDescricao.value.trim();
    const tipo = campoTipo.value;
    const prioridade = campoPrioridade.value;
    const projeto = campoProjeto.value;
    const prazo = campoPrazo.value;

    let formValido = true;

    //Validar Título
    if(titulo === ""){
        mostrarErro(campoTitulo,erroTitulo,"Escreva o título da demanda.");
        formValido=false;
    }

    //Validar Descrição
    if(descricao === ""){
        mostrarErro(campoDescricao,erroDescricao,"Escreva a descrição da demanda.");
        formValido=false;
    }

    //Validar Tipo
    if(tipo === ""){
        mostrarErro(campoTipo,erroTipo,"Escolha o tipo da demanda.");
        formValido=false;
    }

    //Validar Prioridade
    if(prioridade === ""){
        mostrarErro(campoPrioridade,erroPrioridade,"Escolha a prioridade da demanda.");
        formValido=false;
    }

    //Validar Projeto
    if(projeto === ""){
        mostrarErro(campoProjeto,erroProjeto,"Escolha o projeto ao qual se refere essa demanda.");
        formValido=false;
    }

    //Validar Prazo de Finalização
    if(prazo === ""){
        mostrarErro(campoPrazo,erroPrazo,"Escolha um prazo de finalização para a demanda.");
        formValido=false;
    }else{
        const hoje = new Date();

        if(prazo<hoje){
            mostrarErro(campoPrazo,erroPrazo,"Escolha um prazo futuro ao dia de hoje.");
            formValido=false;
        }
    }
});