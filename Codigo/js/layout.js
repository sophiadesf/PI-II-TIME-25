// AUTORIA: Sophia D B Lopes
fetch("topbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("topbar").innerHTML = data;
    });

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
