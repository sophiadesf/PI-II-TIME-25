
const caixa = document.getElementById("alterar_status");
const fundo = document.getElementById("fundoCinza");
let emModoEdicao = false;

function abrir(){
    caixa.style.display = "block";
    fundo.style.display = "block";
}
function fechar(){
    caixa.style.display = "none";
    fundo.style.display = "none";
}

function salvarStatus(){
    const confirmacao = confirm("TEM CERTEZA QUE DESEJA ALTERAR O STATUS?");
    if (confirmacao){
        const novoStatus = document.getElementById("novo_status").value;
        const textoTela = document.getElementById("status");
        
        const statusAntigo = textoTela.textContent.trim();
        let novoStatusTexto = "";
        
        if(novoStatus == 1){
            novoStatusTexto = "Desenvolvimento";
        }
        else if(novoStatus == 2){
            novoStatusTexto = "Análise";
        }
        else if(novoStatus == 3){
            novoStatusTexto = "Aderência";
        }
        if (statusAntigo == novoStatusTexto){
            alert("Erro! Altere para um status diferente do atual.");
            fechar()
            return;

        }
        else{
            textoTela.textContent = novoStatusTexto;
            textoTela.textContent = novoStatusTexto;

        const dataAtual = new Date().toLocaleDateString('pt-BR');
        const horaAtual = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
        const dataHoraFormatada = `${dataAtual} - ${horaAtual}`;

        const timeline = document.getElementById("historicoTimeline");
    
        const novoItemHistorico = `
            <div class="historico-item">
                <span class="historico-data">${dataHoraFormatada}</span>
                <p>Status alterado de <strong>${statusAntigo}</strong> para <strong>${novoStatusTexto}</strong>.</p>
            </div>`;

            timeline.innerHTML = novoItemHistorico + timeline.innerHTML;

            fechar();
        }
      
    }
    else{
        fechar();
    }
}

function ativarEdicao() {
    const btnEditar = document.getElementById("botao-pri");
    
    const spanTitulo = document.getElementById("textoTitulo");
    const spanTipo = document.getElementById("textoTipo");
    const spanProjeto = document.getElementById("textoProjeto");
    const spanResponsavel = document.getElementById("textoResponsavel");
    const spanPrazo = document.getElementById("textoPrazo");

    if (emModoEdicao === false) {
        spanTitulo.innerHTML = `<input type="text" id="inputTitulo" value="${spanTitulo.textContent}" class="form-control form-control-sm">`;
        spanTipo.innerHTML = `<input type="text" id="inputTipo" value="${spanTipo.textContent}" class="form-control form-control-sm">`;
        spanProjeto.innerHTML = `<input type="text" id="inputProjeto" value="${spanProjeto.textContent}" class="form-control form-control-sm">`;
        spanResponsavel.innerHTML = `<input type="text" id="inputResponsavel" value="${spanResponsavel.textContent}" class="form-control form-control-sm">`;
        spanPrazo.innerHTML = `<input type="text" id="inputPrazo" value="${spanPrazo.textContent}" class="form-control form-control-sm">`;

        btnEditar.textContent = "Salvar Alterações";
        btnEditar.style.backgroundColor = "green";
        emModoEdicao = true;
    } else {
        const novoTitulo = document.getElementById("inputTitulo").value;
        const novoTipo = document.getElementById("inputTipo").value;
        const novoProjeto = document.getElementById("inputProjeto").value;
        const novoResponsavel = document.getElementById("inputResponsavel").value;
        const novoPrazo = document.getElementById("inputPrazo").value;

        spanTitulo.textContent = novoTitulo;
        spanTipo.textContent = novoTipo;
        spanProjeto.textContent = novoProjeto;
        spanResponsavel.textContent = novoResponsavel;
        spanPrazo.textContent = novoPrazo;

        btnEditar.textContent = "Editar demanda";
        btnEditar.style.backgroundColor = ""; 
        emModoEdicao = false;

        alert("Alterações salvas com sucesso!");
    }
}