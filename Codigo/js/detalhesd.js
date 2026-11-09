/*
    JavaScript da tela de Detalhes da Demanda.
    As informações são consultadas e salvas no banco pela API.
*/
const API_URL = "http://localhost:3000";
const parametros = new URLSearchParams(window.location.search);
const idDemanda = parametros.get("id");

const caixaStatus = document.getElementById("alterar_status");
const caixaComentario = document.getElementById("caixaComentario");
const fundo = document.getElementById("fundoCinza");
let emModoEdicao = false;
let demandaAtual = null;

function usuarioLogado() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    } catch {
        return null;
    }
}

function idUsuarioLogado() {
    const usuario = usuarioLogado();
    return usuario ? Number(usuario.id || usuario.ID_USUARIO || usuario.idUsuario) : 0;
}

function abrir() {
    caixaStatus.style.display = "block";
    fundo.style.display = "block";
}

function fechar() {
    caixaStatus.style.display = "none";
    caixaComentario.style.display = "none";
    fundo.style.display = "none";
}

function abrirComentario() {
    document.getElementById("textoComentario").value = "";
    caixaComentario.style.display = "block";
    fundo.style.display = "block";
    document.getElementById("textoComentario").focus();
}

function formatarData(data, comHora = false) {
    if (!data) return "-";
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) return String(data);
    return comHora ? dataObj.toLocaleString("pt-BR") : dataObj.toLocaleDateString("pt-BR");
}

function mostrarValor(id, valor, padrao = "-") {
    document.getElementById(id).textContent = valor === null || valor === undefined || valor === "" ? padrao : valor;
}

function traduzirStatus(status) {
    const valores = {
        "Em revisao": "Em revisão",
        "Concluida": "Concluída"
    };
    return valores[status] || status || "-";
}

function valorBancoStatus(status) {
    const valores = {
        "Em revisão": "Em revisao",
        "Concluída": "Concluida"
    };
    return valores[status] || status;
}

function traduzirCampo(campo, valor) {
    if (campo === "Status") return traduzirStatus(valor);
    if (campo === "Prioridade") {
        return ({ "Critica": "Crítica", "Media": "Média" })[valor] || valor;
    }
    if (campo === "Tipo" && valor === "Documentacao") return "Documentação";
    return valor || "Não definido";
}

async function carregarDemanda() {
    if (!idDemanda || !/^\d+$/.test(idDemanda)) {
        alert("ID da demanda inválido.");
        window.location.href = "listademandas.html";
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/demandas/${idDemanda}`);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || dados.error || "Demanda não encontrada.");
        demandaAtual = dados;

        mostrarValor("textoTitulo", dados.titulo);
        mostrarValor("textoTipo", dados.tipo === "Documentacao" ? "Documentação" : dados.tipo);
        mostrarValor("textoProjeto", dados.projeto);
        mostrarValor("textoResponsavel", dados.responsavel, "Não definido");
        mostrarValor("textoPrazo", formatarData(dados.prazo));
        mostrarValor("textoDataCriacao", formatarData(dados.dataCriacao));
        mostrarValor("status", traduzirStatus(dados.status));

        const prioridade = document.getElementById("textoPrioridade");
        prioridade.textContent = traduzirCampo("Prioridade", dados.prioridade);
        prioridade.className = "tag-prioridade";
        if (["alta", "crítica", "critica"].includes(prioridade.textContent.toLowerCase())) {
            prioridade.classList.add("high");
        }

        document.getElementById("novo_status").value = dados.status;
    } catch (erro) {
        console.error(erro);
        alert(erro.message || "Não foi possível carregar a demanda.");
    }
}

async function carregarHistorico() {
    const timeline = document.getElementById("historicoTimeline");
    timeline.innerHTML = '<p class="mensagem-comentarios">Carregando histórico...</p>';
    try {
        const resposta = await fetch(`${API_URL}/demandas/${idDemanda}/historico`);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || "Não foi possível carregar o histórico.");

        timeline.innerHTML = "";
        if (!Array.isArray(dados) || dados.length === 0) {
            timeline.innerHTML = '<p class="mensagem-comentarios">Nenhuma alteração registrada.</p>';
            return;
        }

        dados.forEach((registro) => {
            const item = document.createElement("div");
            item.className = "historico-item";
            const data = document.createElement("span");
            data.className = "historico-data";
            data.textContent = formatarData(registro.dataHora, true);
            const descricao = document.createElement("p");
            descricao.textContent = `${registro.nomeUsuario || "Usuário"} alterou ${registro.campo} de "${traduzirCampo(registro.campo, registro.valorAnterior)}" para "${traduzirCampo(registro.campo, registro.valorNovo)}".`;
            item.append(data, descricao);
            timeline.appendChild(item);
        });
    } catch (erro) {
        console.error(erro);
        timeline.innerHTML = '<p class="mensagem-comentarios">Não foi possível carregar o histórico.</p>';
    }
}

async function carregarComentarios() {
    const lista = document.getElementById("listaComentarios");
    lista.innerHTML = '<p class="mensagem-comentarios">Carregando comentários...</p>';
    try {
        const resposta = await fetch(`${API_URL}/demandas/${idDemanda}/comentarios`);
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.erro || "Não foi possível carregar os comentários.");

        lista.innerHTML = "";
        if (!Array.isArray(dados) || dados.length === 0) {
            lista.innerHTML = '<p class="mensagem-comentarios">Ainda não há comentários nesta demanda.</p>';
            return;
        }

        dados.forEach((comentario) => {
            const item = document.createElement("div");
            item.className = "comentario-item";
            const cabecalho = document.createElement("div");
            cabecalho.className = "comentario-cabecalho";
            const autor = document.createElement("span");
            autor.className = "comentario-autor";
            autor.textContent = comentario.nomeUsuario || "Usuário";
            const data = document.createElement("span");
            data.className = "comentario-data";
            data.textContent = formatarData(comentario.dataHora, true);
            const texto = document.createElement("p");
            texto.className = "comentario-texto";
            texto.textContent = comentario.texto;
            cabecalho.append(autor, data);
            item.append(cabecalho, texto);
            lista.appendChild(item);
        });
    } catch (erro) {
        console.error(erro);
        lista.innerHTML = '<p class="mensagem-comentarios">Não foi possível carregar os comentários.</p>';
    }
}

async function publicarComentario() {
    const campo = document.getElementById("textoComentario");
    const botao = document.getElementById("publicarComentario");
    const texto = campo.value.trim();
    const idUsuario = idUsuarioLogado();

    if (!texto) return alert("Digite um comentário antes de publicar.");
    if (!idUsuario) return alert("Faça login para adicionar um comentário.");

    botao.disabled = true;
    botao.textContent = "Publicando...";
    try {
        const resposta = await fetch(`${API_URL}/demandas/${idDemanda}/comentarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUsuario, texto })
        });
        const resultado = await resposta.json();
        if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível publicar o comentário.");
        fechar();
        await carregarComentarios();
    } catch (erro) {
        alert(erro.message || "Erro ao publicar comentário.");
    } finally {
        botao.disabled = false;
        botao.textContent = "Publicar comentário";
    }
}

async function salvarStatus() {
    const botao = document.getElementById("confirmar");
    const novoStatus = document.getElementById("novo_status").value;
    const statusAntigo = demandaAtual ? demandaAtual.status : "";
    if (statusAntigo === novoStatus) {
        alert("Escolha um status diferente do atual.");
        fechar();
        return;
    }
    const idUsuario = idUsuarioLogado();
    if (!idUsuario) return alert("Faça login novamente para alterar o status.");
    if (!confirm("Tem certeza que deseja alterar o status?")) return fechar();

    botao.disabled = true;
    try {
        const resposta = await fetch(`${API_URL}/demandas/${idDemanda}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus, idUsuario })
        });
        const resultado = await resposta.json();
        if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível alterar o status.");
        fechar();
        await Promise.all([carregarDemanda(), carregarHistorico()]);
    } catch (erro) {
        alert(erro.message);
    } finally {
        botao.disabled = false;
    }
}

function ativarEdicao() {
    const btnEditar = document.getElementById("botao-pri");
    const campos = ["Titulo", "Tipo", "Projeto", "Responsavel", "Prazo"];
    const ids = ["textoTitulo", "textoTipo", "textoProjeto", "textoResponsavel", "textoPrazo"];

    if (!emModoEdicao) {
        const valores = [
            demandaAtual.titulo || "",
            demandaAtual.tipo === "Documentacao" ? "Documentação" : demandaAtual.tipo || "",
            demandaAtual.projeto || "",
            demandaAtual.responsavel || "",
            demandaAtual.prazo ? new Date(demandaAtual.prazo).toISOString().slice(0, 10) : ""
        ];
        ids.forEach((id, indice) => {
            const elemento = document.getElementById(id);
            const tipo = indice === 4 ? "date" : "text";
            elemento.innerHTML = `<input type="${tipo}" id="input${campos[indice]}" value="${String(valores[indice]).replace(/"/g, "&quot;")}" class="form-control form-control-sm">`;
        });
        btnEditar.textContent = "Salvar Alterações";
        emModoEdicao = true;
        return;
    }

    const idUsuario = idUsuarioLogado();
    if (!idUsuario) return alert("Faça login novamente para salvar alterações.");

    const dados = {
        titulo: document.getElementById("inputTitulo").value.trim(),
        tipo: document.getElementById("inputTipo").value.trim() === "Documentação" ? "Documentacao" : document.getElementById("inputTipo").value.trim(),
        projeto: document.getElementById("inputProjeto").value.trim(),
        responsavel: document.getElementById("inputResponsavel").value.trim(),
        prazo: document.getElementById("inputPrazo").value,
        idUsuario
    };
    if (!dados.titulo) return alert("O título não pode ficar vazio.");

    btnEditar.disabled = true;
    fetch(`${API_URL}/demandas/${idDemanda}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(async resposta => {
        const resultado = await resposta.json();
        if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível salvar as alterações.");
        emModoEdicao = false;
        btnEditar.textContent = "Editar demanda";
        await Promise.all([carregarDemanda(), carregarHistorico()]);
    })
    .catch(erro => alert(erro.message))
    .finally(() => { btnEditar.disabled = false; });
}

document.getElementById("botaoAdicionarComentario").addEventListener("click", abrirComentario);
document.getElementById("cancelarComentario").addEventListener("click", fechar);
document.getElementById("publicarComentario").addEventListener("click", publicarComentario);
fundo.addEventListener("click", fechar);

if (idDemanda) {
    carregarDemanda();
    carregarComentarios();
    carregarHistorico();
}
