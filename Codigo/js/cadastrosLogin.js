
/*
    JS das telas de Login, Cadastro e Esqueci a Senha.

    Autor: Sophia de Souza Fabri

    Responsabilidades:
    - Validar os formulários;
    - Integrar o login com a API;
    - Armazenar os dados do usuário autenticado;
    - Manter a autenticação durante a navegação.
*/

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // CONFIGURAÇÃO DA API
    // ----------------------------------------------------

    const API_URL = 'http://localhost:3000';

    // ----------------------------------------------------
    // FUNÇÕES AUXILIARES DE VALIDAÇÃO
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
    // FUNÇÃO PARA MOSTRAR ERROS DA API
    // ----------------------------------------------------

    function mostrarErroGeral(formulario, mensagem) {
        let elemento = document.getElementById('mensagemErroGeral');

        if (!elemento) {
            elemento = document.createElement('div');
            elemento.id = 'mensagemErroGeral';
            elemento.style.color = '#dc3545';
            elemento.style.fontSize = '0.9em';
            elemento.style.marginBottom = '10px';

            formulario.prepend(elemento);
        }

        elemento.textContent = mensagem;
    }

    // ----------------------------------------------------
    // 1. TELA DE CADASTRO
    // ----------------------------------------------------

    const formCadastro = document.getElementById('formCadastro');

    if (formCadastro) {

        formCadastro.addEventListener('submit', (e) => {

            e.preventDefault();

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
                mostrarErro(email, 'Digite um e-mail válido.');
                valido = false;
            } else {
                limparErro(email);
            }

            if (!senha.value) {
                mostrarErro(senha, 'A senha é obrigatória.');
                valido = false;
            } else if (!eSenhaForte(senha.value)) {
                mostrarErro(senha, 'A senha deve ter pelo menos 8 caracteres, letras maiúsculas, minúsculas, números e símbolos.');
                valido = false;
            } else {
                limparErro(senha);
            }

            if (!confirmaSenha.value) {
                mostrarErro(confirmaSenha, 'Confirme sua senha.');
                valido = false;
            } else if (confirmaSenha.value !== senha.value) {
                mostrarErro(confirmaSenha, 'As senhas não coincidem.');
                valido = false;
            } else {
                limparErro(confirmaSenha);
            }

            if (valido) {
                alert('Validações concluídas!');

                /*
                   IMPORTANTE:
                   O cadastro ainda precisa ser conectado
                   à rota de cadastro do backend.
                   Não foi informada a rota dessa operação.
                */
            }

        });
    }

    // ----------------------------------------------------
    // 2. TELA DE LOGIN - INTEGRAÇÃO COM A API
    // ----------------------------------------------------

    const formLogin = document.getElementById('formLogin');

    if (formLogin) {

        formLogin.addEventListener('submit', async (e) => {

            e.preventDefault();

            let valido = true;

            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const botao = formLogin.querySelector('[type="submit"]');

            let mensagemErroGeral = document.getElementById('mensagemErroGeral');

            if (!mensagemErroGeral) {
                mensagemErroGeral = document.createElement('div');
                mensagemErroGeral.id = 'mensagemErroGeral';
                mensagemErroGeral.style.color = '#dc3545';
                mensagemErroGeral.style.marginBottom = '10px';

                formLogin.prepend(mensagemErroGeral);
            }

            mensagemErroGeral.textContent = '';

            // Validação do e-mail
            if (!emailInput.value.trim()) {
                mostrarErro(emailInput, 'O e-mail é obrigatório.');
                valido = false;
            } else if (!eEmailValido(emailInput.value.trim())) {
                mostrarErro(emailInput, 'Digite um e-mail válido.');
                valido = false;
            } else {
                limparErro(emailInput);
            }

            // Validação da senha
            if (!senhaInput.value) {
                mostrarErro(senhaInput, 'A senha é obrigatória.');
                valido = false;
            } else {
                limparErro(senhaInput);
            }

            if (!valido) return;

            try {

                if (botao) {
                    botao.disabled = true;
                    botao.textContent = 'Entrando...';
                }

                // Envia e-mail e senha para a API
                const resposta = await fetch(`${API_URL}/login`, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        senha: senhaInput.value
                    })
                });

                // Trata a resposta da API
                const resultado = await resposta.json();

                if (!resposta.ok) {

                    mensagemErroGeral.textContent =
                        resultado.mensagem ||
                        resultado.erro ||
                        'E-mail ou senha incorretos.';

                    return;
                }

                // Verifica se a API retornou o usuário
                const usuario = resultado.usuario || resultado;

                if (!usuario || !usuario.id) {
                    mensagemErroGeral.textContent =
                        'A API não retornou os dados esperados do usuário.';
                    return;
                }

                // Limpa autenticação anterior
                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('token');

                // Armazena o usuário autenticado
                localStorage.setItem(
                    'usuarioLogado',
                    JSON.stringify(usuario)
                );

                // Armazena o token, caso a API utilize JWT
                if (resultado.token) {
                    localStorage.setItem('token', resultado.token);
                }

                // Redireciona para o Dashboard
                window.location.href = '../Dashboard/dashboard.html';

            } catch (erro) {

                console.error('Erro ao realizar login:', erro);

                mensagemErroGeral.textContent =
                    'Não foi possível conectar ao servidor. Verifique se a API está funcionando.';

            } finally {

                if (botao) {
                    botao.disabled = false;
                    botao.textContent = 'Entrar';
                }

            }

        });

    }

    // ----------------------------------------------------
    // 3. TELA ESQUECI A SENHA
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
                mostrarErro(email, 'Digite um e-mail válido.');
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
