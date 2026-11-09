/*
    JS da tela de Listagem de Demandas (busca e filtros)

    Autor: João Felipe Bodo Pinheiro
*/

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

    if (validacao) {
        // Mapeia os arrays booleanos para as strings que o banco/backend esperam
        const statusSelecionados = [];
        if (aberto) statusSelecionados.push('Aberta');
        if (andamento) statusSelecionados.push('Em andamento');
        if (revisao) statusSelecionados.push('Em revisão');
        if (concluida) statusSelecionados.push('Concluída');
        if (cancelada) statusSelecionados.push('Cancelada');

        const prioridadeSelecionadas = [];
        if (critica) prioridadeSelecionadas.push('Crítica');
        if (alta) prioridadeSelecionadas.push('Alta');
        if (media) prioridadeSelecionadas.push('Média');
        if (baixa) prioridadeSelecionadas.push('Baixa');

        const tiposSelecionados = [];
        if (tarefa) tiposSelecionados.push('Tarefa');
        if (defeito) tiposSelecionados.push('Defeito');
        if (melhoria) tiposSelecionados.push('Melhoria');
        if (documentacao) tiposSelecionados.push('Documentação');

        const params = new URLSearchParams();
        if (pesquisa) params.append('busca', pesquisa);
        if (statusSelecionados.length > 0) params.append('status', statusSelecionados.join(','));
        if (prioridadeSelecionadas.length > 0) params.append('prioridade', prioridadeSelecionadas.join(','));
        if (tiposSelecionados.length > 0) params.append('tipo', tiposSelecionados.join(','));

        carregarDemandas(params.toString());
    }
}); 

// Busca os dados no backend
async function carregarDemandas(queryString = "") {
    try {
        const urlBase = 'http://localhost:3000/demandas'; 
        const urlFinal = queryString ? `${urlBase}?${queryString}` : urlBase;

        const response = await fetch(urlFinal);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao carregar demandas');
        }

        const demandas = await response.json();
        renderizarCards(demandas);

    } catch (error) {
        console.error("Falha na requisição:", error);
        
        mostrarErro(btnFiltro, erroFiltro, "Falha de conexão com o servidor.");

        const containerLista = document.querySelector('.listagem');
        const textoContador = document.querySelector('.cabecalho-ld p'); 

        if (textoContador) textoContador.textContent = "Erro de conexão.";

        if (containerLista) {
            containerLista.innerHTML = `
                <div style="flex: 1 1 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 15vh; text-align: center; width: 100%;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="#dc3545" style="margin-bottom: 15px;">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <h4 style="color: #dc3545; font-weight: 600; margin-bottom: 10px;">Servidor Indisponível</h4>
                    <p style="color: #666; font-size: 1.1rem; max-width: 400px; margin: 0 auto;">
                        Não foi possível estabelecer ligação com a base de dados. Verifique se o servidor backend está ligado e tente novamente.
                    </p>
                </div>
            `;
        }
    }
}

// Injeta o HTML na tela
function renderizarCards(demandas) {

    const containerLista = document.querySelector('.listagem');
    const textoContador = document.querySelector('.cabecalho-ld p'); 

    if (!containerLista) return;

    containerLista.innerHTML = '';

    if (textoContador) {
        const plural = demandas.length === 1 ? 'demanda cadastrada' : 'demandas cadastradas';
        textoContador.textContent = `${demandas.length} ${plural}.`;
    }

    if (demandas.length === 0) {
        containerLista.innerHTML = `
            <div style="flex: 1 1 100%; display: flex; justify-content: center; padding-top: 15vh; width: 100%;">
                <p style="color: #666; font-size: 1.2rem; font-weight: 500;">Nenhuma demanda encontrada com estes filtros.</p>
            </div>
        `;
        return;
    }

    demandas.forEach(demanda => {
        const cardHTML = `
            <div class="card-ld shadow">
                <div>
                    <h3>${demanda.TITULO || demanda.titulo}</h3>
                    <p>${demanda.DESCRICAO || demanda.descricao}</p>
                    <ul>
                        <li><strong>Tipo:</strong> ${demanda.TIPO || demanda.tipo}</li>
                        <li><strong>Prioridade:</strong> ${demanda.PRIORIDADE || demanda.prioridade}</li>
                        <li><strong>Responsável:</strong> ${demanda.RESPONSAVEL || demanda.responsavel}</li>
                        <li><strong>Status:</strong> ${demanda.STATUS || demanda.status}</li>
                    </ul>
                </div>
                <!-- O href manda o ID na URL para a próxima tela abrir os detalhes certos -->
                <a href="detalhesdemanda.html?id=${demanda.ID || demanda.id}" class="detalhes-ld">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" fill="currentColor">
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/>
                    </svg>
                </a>
            </div>
        `;
                containerLista.insertAdjacentHTML('beforeend', cardHTML);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarDemandas(); 
});