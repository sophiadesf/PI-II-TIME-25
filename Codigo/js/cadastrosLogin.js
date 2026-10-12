document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // FUNÇÕES AUXILIARES DE VALIDAÇÃO - feito por Sophia Fabri
    // ----------------------------------------------------

    function mostrarErro(input, mensagem) {
        let erroDiv = input.nextElementSibling;
        if (!erroDiv || !erroDiv.classList.contains('erro-mensagem')) {
            erroDiv = document.createElement('div');
            erroDiv.className = 'erro-mensagem';
            erroDiv.style.color = '#dc3545';
            erroDiv.style.fontSize = '0.85em';
            erroDiv.style.marginTop = '4px';
            input.parentNode.insertBefore(erroDiv, input.nextSibling);
        }
        erroDiv.textContent = mensagem;
        input.style.borderColor = '#dc3545';
    }

    function limparErro(input) {
        const erroDiv = input.nextElementSibling;
        if (erroDiv && erroDiv.classList.contains('erro-mensagem')) {
            erroDiv.remove();
        }
        input.style.borderColor = '#ccc';
    }

    function eEmailValido(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function eSenhaForte(senha) {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(senha);
    }

    // ----------------------------------------------------
    // 1. VALIDAÇÃO DA TELA DE CADASTRO
    // ----------------------------------------------------
    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita o envio padrão para tratar via validação/fetch se necessário
            let valido = true;

            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const senha = document.getElementById('senha');
            const confirmaSenha = document.getElementById('confirmaSenha');

            if (!nome.value.trim()) {
                mostrarErro(nome, 'O nome é obrigatório.');
                valido = false;
            } else if (nome.value.trim().length < 3) {
                mostrarErro(nome, 'O nome deve ter pelo menos 3 caracteres.');
                valido = false;
            } else {
                limparErro(nome);
            }

            if (!email.value.trim()) {
                mostrarErro(email, 'O e-mail é obrigatório.');
                valido = false;
            } else if (!eEmailValido(email.value.trim())) {
                mostrarErro(email, 'Digite um formato de e-mail válido.');
                valido = false;
            } else {
                limparErro(email);
            }

            if (!senha.value) {
                mostrarErro(senha, 'A senha é obrigatória.');
                valido = false;
            } else if (!eSenhaForte(senha.value)) {
                mostrarErro(senha, 'A senha deve ter no mínimo 8 caracteres, incluir letras maiúsculas, minúsculas, números e símbolos.');
                valido = false;
            } else {
                limparErro(senha);
            }

            if (!confirmaSenha.value) {
                mostrarErro(confirmaSenha, 'Confirme a sua senha.');
                valido = false;
            } else if (confirmaSenha.value !== senha.value) {
                mostrarErro(confirmaSenha, 'As senhas não coincidem.');
                valido = false;
            } else {
                limparErro(confirmaSenha);
            }

            if (valido) {
                alert('Cadastro efetuado com sucesso!');
                // formCadastro.submit(); // Descomente caso o envio seja tradicional por formulário HTML
            }
        });
    }

    // ----------------------------------------------------
    // 2. VALIDAÇÃO E ENVIO DA TELA DE LOGIN (COM FETCH)
    // ----------------------------------------------------
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            let valido = true;
            // Se na sua página de login o input de email tiver outro ID, ajuste aqui (ex: 'emailLogin')
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');

            if (!emailInput.value.trim()) {
                mostrarErro(emailInput, 'O e-mail é obrigatório.');
                valido = false;
            } else if (!eEmailValido(emailInput.value.trim())) {
                mostrarErro(emailInput, 'Insira um e-mail válido.');
                valido = false;
            } else {
                limparErro(emailInput);
            }

            if (!senhaInput.value) {
                mostrarErro(senhaInput, 'A senha é obrigatória.');
                valido = false;
            } else {
                limparErro(senhaInput);
            }

            if (!valido) return;

            try {
                const resposta = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        senha: senhaInput.value
                    })
                });

                const resultado = await resposta.json();

                if (resposta.ok) {
                    alert('Login bem-sucedido! Bem-vindo, ' + resultado.usuario.nome);
                    // window.location.href = 'dashboard.html';
                } else {
                    alert('Erro no login: ' + resultado.erro);
                }
            } catch (erro) {
                console.error('Erro de conexão com o servidor:', erro);
                alert('Não foi possível conectar ao servidor. Verifique se o server.js está a rodar.');
            }
        });
    }

    // ----------------------------------------------------
    // 3. VALIDAÇÃO DA TELA DE ESQUECI A SENHA
    // ----------------------------------------------------
    const formEsqueciSenha = document.getElementById('formEsqueciSenha');
    if (formEsqueciSenha) {
        formEsqueciSenha.addEventListener('submit', (e) => {
            let valido = true;

            const email = document.getElementById('email');
            const novaSenha = document.getElementById('novaSenha');

            if (!email.value.trim()) {
                mostrarErro(email, 'Informe o e-mail cadastrado.');
                valido = false;
            } else if (!eEmailValido(email.value.trim())) {
                mostrarErro(email, 'Insira um e-mail válido.');
                valido = false;
            } else {
                limparErro(email);
            }

            if (novaSenha) {
                if (!novaSenha.value) {
                    mostrarErro(novaSenha, 'A nova senha é obrigatória.');
                    valido = false;
                } else if (!eSenhaForte(novaSenha.value)) {
                    mostrarErro(novaSenha, 'A nova senha não cumpre os requisitos de segurança.');
                    valido = false;
                } else {
                    limparErro(novaSenha);
                }
            }

            if (!valido) {
                e.preventDefault();
            }
        });
    }
});
