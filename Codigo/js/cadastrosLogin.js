/*
    JS das telas de Login, Cadastro e Esqueci a Senha.

    Autor: Sophia de Souza Fabri
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
    // FUNÇÕES DE FEEDBACK DA API (ERRO E SUCESSO)
    // ----------------------------------------------------

    function mostrarErroGeral(formulario, mensagem) {
        let elemento = document.getElementById('mensagemErroGeral');

        if (!elemento) {
            elemento = document.createElement('div');
            elemento.id = 'mensagemErroGeral';
            elemento.className = 'alert alert-danger mt-2';
            elemento.style.color = '#dc3545';
            elemento.style.fontSize = '0.9em';
            elemento.style.marginBottom = '10px';

            formulario.prepend(elemento);
        }

        elemento.textContent = mensagem;
    }

    function mostrarSucessoGeral(formulario, mensagem) {
        let elemento = document.getElementById('mensagemSucessoGeral');

        if (!elemento) {
            elemento = document.createElement('div');
            elemento.id = 'mensagemSucessoGeral';
            elemento.className = 'alert alert-success mt-2';
            elemento.style.color = '#198754';
            elemento.style.fontSize = '0.9em';
            elemento.style.marginBottom = '10px';

            formulario.prepend(elemento);
        }

        elemento.textContent = mensagem;
    }

    function limparMensagens(formulario) {
        const erro = document.getElementById('mensagemErroGeral');
        if (erro) erro.remove();

        const sucesso = document.getElementById('mensagemSucessoGeral');
        if (sucesso) sucesso.remove();
    }

    // ----------------------------------------------------
    // 1. TELA DE CADASTRO - INTEGRAÇÃO COM A API
    // ----------------------------------------------------

    const formCadastro = document.getElementById('formCadastro');

    if (formCadastro) {

        formCadastro.addEventListener('submit', async (e) => {

            e.preventDefault();
            limparMensagens(formCadastro);

            let valido = true;

            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const confirmaSenhaInput = document.getElementById('confirmaSenha');
            const botao = formCadastro.querySelector('[type="submit"]');

            if (!nomeInput.value.trim()) {
                mostrarErro(nomeInput, 'O nome é obrigatório.');
                valido = false;
            } else if (nomeInput.value.trim().length < 3) {
                mostrarErro(nomeInput, 'O nome deve ter pelo menos 3 caracteres.');
                valido = false;
            } else {
                limparErro(nomeInput);
            }

            if (!emailInput.value.trim()) {
                mostrarErro(emailInput, 'O e-mail é obrigatório.');
                valido = false;
            } else if (!eEmailValido(emailInput.value.trim())) {
                mostrarErro(emailInput, 'Digite um e-mail válido.');
                valido = false;
            } else {
                limparErro(emailInput);
            }

            if (!senhaInput.value) {
                mostrarErro(senhaInput, 'A senha é obrigatória.');
                valido = false;
            } else if (!eSenhaForte(senhaInput.value)) {
                mostrarErro(senhaInput, 'A senha deve ter pelo menos 8 caracteres, letras maiúsculas, minúsculas, números e símbolos.');
                valido = false;
            } else {
                limparErro(senhaInput);
            }

            if (!confirmaSenhaInput.value) {
                mostrarErro(confirmaSenhaInput, 'Confirme sua senha.');
                valido = false;
            } else if (confirmaSenhaInput.value !== senhaInput.value) {
                mostrarErro(confirmaSenhaInput, 'As senhas não coincidem.');
                valido = false;
            } else {
                limparErro(confirmaSenhaInput);
            }

            if (!valido) return;

            try {
                if (botao) {
                    botao.disabled = true;
                    botao.textContent = 'Cadastrando...';
                }

                const resposta = await fetch(`${API_URL}/usuarios`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome: nomeInput.value.trim(),
                        email: emailInput.value.trim(),
                        senha: senhaInput.value
                    })
                });

                const resultado = await resposta.json();

                if (!resposta.ok) {
                    mostrarErroGeral(
                        formCadastro,
                        resultado.mensagem || resultado.erro || `Erro no cadastro (${resposta.status}). Tente novamente.`
                    );
                    return;
                }

                mostrarSucessoGeral(formCadastro, 'Cadastro realizado com sucesso! Redirecionando para o login...');

                formCadastro.reset();

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (erro) {
                console.error('Erro ao realizar cadastro:', erro);
                mostrarErroGeral(
                    formCadastro,
                    'Não foi possível conectar ao servidor. Verifique se a API está em execução.'
                );
            } finally {
                if (botao) {
                    botao.disabled = false;
                    botao.textContent = 'Cadastrar';
                }
            }

        });
    }

    // ----------------------------------------------------
    // 2. TELA DE LOGIN - INTEGRAÇÃO COM A API (CORRIGIDA)
    // ----------------------------------------------------

    const formLogin = document.getElementById('formLogin');

    if (formLogin) {

        formLogin.addEventListener('submit', async (e) => {

            e.preventDefault();
            limparMensagens(formLogin);

            let valido = true;

            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const botao = formLogin.querySelector('[type="submit"]');

            if (!emailInput.value.trim()) {
                mostrarErro(emailInput, 'O e-mail é obrigatório.');
                valido = false;
            } else if (!eEmailValido(emailInput.value.trim())) {
                mostrarErro(emailInput, 'Digite um e-mail válido.');
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

                if (botao) {
                    botao.disabled = true;
                    botao.textContent = 'Entrando...';
                }

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

                const resultado = await resposta.json();

                if (!resposta.ok) {
                    mostrarErroGeral(
                        formLogin,
                        resultado.mensagem || resultado.erro || `Falha na autenticação (${resposta.status}). Verifique seus dados.`
                    );
                    return;
                }

                const usuario = resultado.usuario || resultado;

                if (!usuario || (!usuario.id && !usuario.ID)) {
                    mostrarErroGeral(
                        formLogin,
                        'A API não retornou os dados esperados do usuário.'
                    );
                    return;
                }

                localStorage.removeItem('usuarioLogado');
                localStorage.removeItem('token');

                // Salva a sessão do usuário logado
                localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

                if (resultado.token) {
                    localStorage.setItem('token', resultado.token);
                }

                // CORREÇÃO: Redireciona para index.html conforme exigido pelo projeto
                window.location.href = 'index.html';

            } catch (erro) {

                console.error('Erro ao realizar login:', erro);

                mostrarErroGeral(
                    formLogin,
                    'Não foi possível conectar ao servidor. Verifique se a API está funcionando.'
                );

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
            e.preventDefault();

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

            if (!valido) return;

            mostrarSucessoGeral(formEsqueciSenha, 'Instruções enviadas com sucesso!');
        });

    }

});
