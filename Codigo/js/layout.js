fetch("topbar.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("topbar").innerHTML = data;
    });

fetch("menu.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("menu").innerHTML = data;
    });