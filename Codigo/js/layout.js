/*
    JS que carrega o menu e a barra superior em todas as telas

    Autor: Sophia Dalla Bernardina Lopes
*/

const titulos = {
    "login.html": "Login",
    "cadastro.html": "Cadastro",
    "index.html": "Dashboard",
    "listademandas.html": "Lista de Demandas",
    "novademanda.html": "Nova Demanda",
    "detalhesdemanda.html": "Detalhes da Demanda",
    "esqueci-senha.html": "Recuperar Senha"
};

const pagina = window.location.pathname.split("/").pop();

fetch("topbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("topbar").innerHTML = data;

        const titulo = titulos[pagina] || "Sistema";

        document.getElementById("topbar-titulo").textContent = titulo;
    })
    .catch(erro => console.error("Erro ao carregar topbar:", erro));
    
fetch("menu.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("menu").innerHTML = data;

        const paginaAtual = window.location.pathname.split("/").pop();

        const itensMenu = document.querySelectorAll(".menu-item");

        itensMenu.forEach(function(item) {
            const link = item.getAttribute("href");

            if (link === paginaAtual) {
                item.classList.add("active");
            }
        });
    });

    
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

function protegerPagina() {
    const pagina = window.location.pathname.split("/").pop();

    // Páginas que podem ser acessadas sem login
    const paginasPublicas = [
        "login.html",
        "cadastro.html",
        "esqueci-senha.html"
    ];

    const usuarioId = pegarIdUsuarioLogado();

    // Se não estiver logado e tentar acessar uma página privada
    if (!usuarioId && !paginasPublicas.includes(pagina)) {
        window.location.replace("login.html");
        return;
    }

    // Se já estiver logado e tentar acessar o login ou cadastro
    if (usuarioId && paginasPublicas.includes(pagina)) {
        window.location.replace("index.html");
    }
}

// Executa a proteção assim que o arquivo for carregado
protegerPagina();