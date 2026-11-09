/**
 * Js do formulário de Cadastro de Demandas
 * (validação dos campos e envio da demanda para a API, que grava no banco de dados)
 *
 * Autor: Pedro Tafner
 *
 */

// Endereço da API (servidor Node.js)
const API_URL = "http://localhost:3000";

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
const mensagemResultado = document.querySelector("#mensagemResultado");

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

    painelResultado.classList.add("d-none");
}

// Mostra a mensagem de sucesso (verde) ou de erro (vermelha) embaixo do formulário
// "mensagens" pode ser um texto ou uma lista de textos
function mostrarResultado(sucesso, mensagens) {
    mensagemResultado.className = sucesso ? "alert alert-success" : "alert alert-danger";
    mensagemResultado.innerHTML = "";

    if (Array.isArray(mensagens)) {
        const lista = document.createElement("ul");
        lista.classList.add("mb-0");

        mensagens.forEach(function (mensagem) {
            const item = document.createElement("li");
            item.textContent = mensagem;
            lista.appendChild(item);
        });

        mensagemResultado.appendChild(lista);
    } else {
        mensagemResultado.textContent = mensagens;
    }

    painelResultado.classList.remove("d-none");
}

// Coloca as opções em um select (lista de { id, nome })
function preencherSelect(select, opcoes, textoPrimeiraOpcao) {
    select.innerHTML = "";

    const primeiraOpcao = document.createElement("option");
    primeiraOpcao.value = "";
    primeiraOpcao.textContent = textoPrimeiraOpcao;
    select.appendChild(primeiraOpcao);

    opcoes.forEach(function (opcao) {
        const elemento = document.createElement("option");
        elemento.value = opcao.id;
        elemento.textContent = opcao.nome;
        select.appendChild(elemento);
    });
}

// Pega o usuário que fez login (guardado pela tela de login no localStorage)
// Devolve o id do usuário ou null se ninguém estiver logado
function pegarIdUsuarioLogado() {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");

    if (!usuarioSalvo) {
        return null;
    }

    try {
        const usuario = JSON.parse(usuarioSalvo);
        return usuario.id || usuario.ID || null;
    } catch (erro) {
        return null;
    }
}

// Busca os projetos no banco (GET /projetos) e coloca no select de projeto
async function carregarProjetos() {
    try {
        const resposta = await fetch(`${API_URL}/projetos`);
        const projetos = await resposta.json();

        if (!resposta.ok) {
            throw new Error(projetos.erro);
        }

        preencherSelect(campoProjeto, projetos, "Selecione...");
    } catch (erro) {
        preencherSelect(campoProjeto, [], "Erro ao carregar");
        mostrarResultado(false, "Não foi possível carregar os projetos. Verifique se o servidor está ligado (npm start).");
    }
}

// Busca os membros do projeto escolhido (GET /projetos/:id/usuarios) e coloca no select de responsável
async function carregarResponsaveis(idProjeto) {
    if (idProjeto === "") {
        preencherSelect(campoResponsavel, [], "Escolha o projeto primeiro");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/projetos/${idProjeto}/usuarios`);
        const usuarios = await resposta.json();

        if (!resposta.ok) {
            throw new Error(usuarios.erro);
        }

        preencherSelect(campoResponsavel, usuarios, "Sem responsável por enquanto");
    } catch (erro) {
        preencherSelect(campoResponsavel, [], "Erro ao carregar");
    }
}

// Quando trocar o projeto, atualiza a lista de responsáveis
campoProjeto.addEventListener("change", function () {
    carregarResponsaveis(campoProjeto.value);
});

// Carrega os projetos assim que a página abre
carregarProjetos();


formulario.addEventListener("submit", async function(event){
    event.preventDefault();
    limparErros();

    const titulo = campoTitulo.value.trim();
    const descricao = campoDescricao.value.trim();
    const tipo = campoTipo.value;
    const prioridade = campoPrioridade.value;
    const projeto = campoProjeto.value;
    const responsavel = campoResponsavel.value;
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
        // Data de hoje no mesmo formato do campo (AAAA-MM-DD) para poder comparar
        const hoje = new Date();
        const mes = String(hoje.getMonth() + 1).padStart(2, "0");
        const dia = String(hoje.getDate()).padStart(2, "0");
        const hojeTexto = `${hoje.getFullYear()}-${mes}-${dia}`;

        if(prazo < hojeTexto){
            mostrarErro(campoPrazo,erroPrazo,"Escolha um prazo a partir de hoje.");
            formValido=false;
        }
    }

    if(!formValido){
        return;
    }

    //Validar usuário logado (ele é o solicitante da demanda)
    const idSolicitante = pegarIdUsuarioLogado();

    if(idSolicitante === null){
        mostrarResultado(false, "Você precisa fazer login para cadastrar uma demanda.");
        return;
    }

    // Monta o objeto que vai para a API (o servidor define o status e as datas)
    const novaDemanda = {
        titulo: titulo,
        descricao: descricao,
        tipo: tipo,
        prioridade: prioridade,
        idProjeto: Number(projeto),
        idResponsavel: responsavel === "" ? null : Number(responsavel),
        idSolicitante: idSolicitante,
        prazo: prazo
    };

    try {
        // Envia para a API (POST /demandas), que grava no banco de dados
        const resposta = await fetch(`${API_URL}/demandas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaDemanda)
        });

        const resultado = await resposta.json();

        if(resposta.status === 201){
            mostrarResultado(true, `Demanda nº ${resultado.id} cadastrada com sucesso no projeto ${resultado.nomeProjeto}!`);
            formulario.reset();
            preencherSelect(campoResponsavel, [], "Escolha o projeto primeiro");
        }else if(resultado.erros){
            // 400: a API devolve a lista de erros de validação
            mostrarResultado(false, resultado.erros);
        }else{
            mostrarResultado(false, resultado.erro || "Não foi possível cadastrar a demanda.");
        }
    } catch (erro) {
        mostrarResultado(false, "Não foi possível conectar à API. Verifique se o servidor está ligado (npm start).");
    }
});
