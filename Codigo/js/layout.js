/*
    JS que carrega o menu e a barra superior em todas as telas

    Autor: Sophia Dalla Bernardita Lopes
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
