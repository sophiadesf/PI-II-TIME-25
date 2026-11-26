/**
 * Js do formulário de Cadastro de Demandas
 * (validação dos campos e envio da demanda para a API, que grava no banco de dados)
 *
 * Autor: Pedro Tafner
 *
 */

// Endereço da API (servidor Node.js)
const API_URL = "http://localhost:3000";

// Perfis que podem cadastrar demandas (Documento de Visão, item 2.1)
// Os valores vêm do banco SEM acento ("Lider de Projeto")
const PERFIS_QUE_CADASTRAM = ["Administrador", "Lider de Projeto"];

// Tamanho máximo dos textos (o mesmo limite das colunas da tabela DEMANDAS)
const TAMANHO_MAXIMO_TITULO = 150;
const TAMANHO_MAXIMO_DESCRICAO = 2000;

const formulario = document.querySelector("#formDemanda");
const botaoCadastrar = formulario.querySelector('button[type="submit"]');
const avisoPermissao = document.querySelector("#avisoPermissao");

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

// Mostra a mensagem de sucesso com um link para abrir a demanda que acabou de ser criada
function mostrarSucesso(demanda) {
    mostrarResultado(true, `Demanda nº ${demanda.id} cadastrada com sucesso no projeto ${demanda.nomeProjeto}! `);

    const link = document.createElement("a");
    link.href = `detalhesdemanda.html?id=${demanda.id}`;
    link.className = "alert-link";
    link.textContent = "Ver detalhes da demanda";
    mensagemResultado.appendChild(link);
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
// Devolve o objeto do usuário ({ id, nome, perfil, ... }) ou null se ninguém estiver logado
function pegarUsuarioLogado() {
    const usuarioSalvo = localStorage.getItem("usuarioLogado");

    if (!usuarioSalvo) {
        return null;
    }

    try {
        const usuario = JSON.parse(usuarioSalvo);
        const id = usuario.id || usuario.ID;

        if (!id) {
            return null;
        }

        return { id: id, nome: usuario.nome || usuario.NOME, perfil: usuario.perfil || usuario.PERFIL };
    } catch (erro) {
        return null;
    }
}

// Lê a resposta da API como JSON (se a resposta não for JSON, devolve um objeto vazio)
async function lerJson(resposta) {
    try {
        return await resposta.json();
    } catch (erro) {
        return {};
    }
}

// Data de hoje no mesmo formato do campo de data (AAAA-MM-DD), para poder comparar
function dataDeHoje() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    return `${hoje.getFullYear()}-${mes}-${dia}`;
}

// Busca no banco (GET /projetos) os projetos em que o usuário pode cadastrar demandas
// e coloca no select de projeto (o Administrador vê todos; o Líder só os projetos dele)
async function carregarProjetos(idUsuario) {
    try {
        const resposta = await fetch(`${API_URL}/projetos?idUsuario=${idUsuario}`);
        const projetos = await lerJson(resposta);

        if (!resposta.ok) {
            preencherSelect(campoProjeto, [], "Erro ao carregar");
            mostrarResultado(false, projetos.erro || `Não foi possível carregar os projetos (erro ${resposta.status}).`);
            return;
        }

        if (projetos.length === 0) {
            preencherSelect(campoProjeto, [], "Nenhum projeto disponível");
            mostrarResultado(false, "Você não está vinculado a nenhum projeto, então não é possível cadastrar demandas.");
            return;
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
        const usuarios = await lerJson(resposta);

        if (!resposta.ok) {
            throw new Error(usuarios.erro);
        }

        preencherSelect(campoResponsavel, usuarios, "Sem responsável por enquanto");
    } catch (erro) {
        preencherSelect(campoResponsavel, [], "Erro ao carregar");
    }
}

// Mostra os erros de validação devolvidos pela API (status 400)
// Os erros sobre o prazo (data passada, feriado nacional) também ficam marcados no próprio campo
function mostrarErrosDaApi(erros) {
    const errosDoPrazo = erros.filter(function (mensagem) {
        return mensagem.toLowerCase().includes("prazo");
    });

    if (errosDoPrazo.length > 0) {
        mostrarErro(campoPrazo, erroPrazo, errosDoPrazo.join(" "));
    }

    mostrarResultado(false, erros);
}

// ---------- Ao abrir a página ----------

const usuarioLogado = pegarUsuarioLogado();

if (usuarioLogado === null) {
    // Sem login (o layout.js já manda para a tela de login, isso é só por garantia)
    formulario.classList.add("d-none");
    avisoPermissao.textContent = "Você precisa fazer login para cadastrar uma demanda.";
    avisoPermissao.classList.remove("d-none");
} else if (!PERFIS_QUE_CADASTRAM.includes(usuarioLogado.perfil)) {
    // Membro da Equipe não pode criar demandas: esconde o formulário e explica o motivo
    formulario.classList.add("d-none");
    avisoPermissao.textContent = `Seu perfil (${usuarioLogado.perfil || "sem perfil"}) não tem permissão para cadastrar demandas. Apenas Administradores e Líderes de Projeto podem cadastrar.`;
    avisoPermissao.classList.remove("d-none");
} else {
    // Não deixa escolher no calendário uma data que já passou
    campoPrazo.min = dataDeHoje();

    // Quando trocar o projeto, atualiza a lista de responsáveis
    campoProjeto.addEventListener("change", function () {
        carregarResponsaveis(campoProjeto.value);
    });

    // Carrega os projetos assim que a página abre
    carregarProjetos(usuarioLogado.id);
}


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
    }else if(titulo.length > TAMANHO_MAXIMO_TITULO){
        mostrarErro(campoTitulo,erroTitulo,`O título pode ter no máximo ${TAMANHO_MAXIMO_TITULO} caracteres.`);
        formValido=false;
    }

    //Validar Descrição
    if(descricao === ""){
        mostrarErro(campoDescricao,erroDescricao,"Escreva a descrição da demanda.");
        formValido=false;
    }else if(descricao.length > TAMANHO_MAXIMO_DESCRICAO){
        mostrarErro(campoDescricao,erroDescricao,`A descrição pode ter no máximo ${TAMANHO_MAXIMO_DESCRICAO} caracteres.`);
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

    //Validar Prazo de Finalização (opcional: pode ser definido agora ou depois, item 2.2.5)
    // O campo de data fica vazio se o texto digitado não for uma data completa
    if(prazo === "" && campoPrazo.validity.badInput){
        mostrarErro(campoPrazo,erroPrazo,"Data incompleta. Preencha o dia, o mês e o ano ou deixe o prazo em branco.");
        formValido=false;
    }else if(prazo !== "" && prazo < dataDeHoje()){
        mostrarErro(campoPrazo,erroPrazo,"Escolha um prazo a partir de hoje.");
        formValido=false;
    }
    // Obs: se a data é feriado nacional quem verifica é a API (consultando a BrasilAPI)

    if(!formValido){
        return;
    }

    //Validar usuário logado (ele é o solicitante da demanda)
    if(usuarioLogado === null){
        mostrarResultado(false, "Você precisa fazer login para cadastrar uma demanda.");
        return;
    }

    // Monta o objeto que vai para a API (o servidor define o status "Aberta" e as datas)
    const novaDemanda = {
        titulo: titulo,
        descricao: descricao,
        tipo: tipo,
        prioridade: prioridade,
        idProjeto: Number(projeto),
        idResponsavel: responsavel === "" ? null : Number(responsavel),
        idSolicitante: usuarioLogado.id,
        prazo: prazo === "" ? null : prazo
    };

    // Desativa o botão enquanto envia, para não cadastrar a mesma demanda duas vezes
    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = "Cadastrando...";

    try {
        // Envia para a API (POST /demandas), que grava no banco de dados
        const resposta = await fetch(`${API_URL}/demandas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaDemanda)
        });

        const resultado = await lerJson(resposta);

        if(resposta.status === 201){
            mostrarSucesso(resultado);
            formulario.reset();
            preencherSelect(campoResponsavel, [], "Escolha o projeto primeiro");
        }else if(Array.isArray(resultado.erros)){
            // 400: a API devolve a lista de erros de validação
            mostrarErrosDaApi(resultado.erros);
        }else{
            // 401, 403, 500, 503...: a API devolve uma mensagem de erro
            mostrarResultado(false, resultado.erro || `Não foi possível cadastrar a demanda (erro ${resposta.status}).`);
        }
    } catch (erro) {
        mostrarResultado(false, "Não foi possível conectar à API. Verifique se o servidor está ligado (npm start).");
    } finally {
        botaoCadastrar.disabled = false;
        botaoCadastrar.textContent = "Cadastrar Demanda";
    }
});
