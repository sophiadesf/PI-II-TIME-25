document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // FUNÇÕES AUXILIARES DE VALIDAÇÃO
    // ----------------------------------------------------

    // AUDITORIA SOPHIA FABRI, funções de validação de campos de cadastro, login e esqueci senha

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

    // Validar formato de e-mail
    function eEmailValido(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Aplicar regras de senha (mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial)
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
            let valido = true;

            const nome = document.getElementById('nome');
            const email = document.getElementById('email');
            const senha = document.getElementById('senha');
            const confirmaSenha = document.getElementById('confirmaSenha');

            // Impedir envio de campos obrigatórios vazios & validar tamanho mínimo
            if (!nome.value.trim()) {
                mostrarErro(nome, 'O nome é obrigatório.');
                valido = false;
            } else if (nome.value.trim().length < 3) {
                mostrarErro(nome, 'O nome deve ter pelo menos 3 caracteres.');
                valido = false;
            } else {
                limparErro(nome);
            }

            // Validar e-mail
            if (!email.value.trim()) {
                mostrarErro(email, 'O e-mail é obrigatório.');
                valido = false;
            } else if (!eEmailValido(email.value.trim())) {
                mostrarErro(email, 'Digite um formato de e-mail válido (ex: usuario@dominio.com).');
                valido = false;
            } else {
                limparErro(email);
            }

            // Validar regras da senha
            if (!senha.value) {
                mostrarErro(senha, 'A senha é obrigatória.');
                valido = false;
            } else if (!eSenhaForte(senha.value)) {
                mostrarErro(senha, 'A senha deve ter no mínimo 8 caracteres, incluir letras maiúsculas, minúsculas, números e símbolos (@$!%*?&).');
                valido = false;
            } else {
                limparErro(senha);
            }

            // Confirmar senha
            if (!confirmaSenha.value) {
                mostrarErro(confirmaSenha, 'Confirme a sua senha.');
                valido = false;
            } else if (confirmaSenha.value !== senha.value) {
                mostrarErro(confirmaSenha, 'As senhas não coincidem.');
                valido = false;
            } else {
                limparErro(confirmaSenha);
            }

            // Impedir o envio enquanto houver dados inválidos
            if (!valido) {
                e.preventDefault();
            } else {
                alert('Cadastro efetuado com sucesso!');
            }
        });
    }

    // ----------------------------------------------------
    // 2. VALIDAÇÃO DA TELA DE LOGIN
    // ----------------------------------------------------
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            let valido = true;

            const email = document.getElementById('email');
            const senha = document.getElementById('senha');

            if (!email.value.trim()) {
                mostrarErro(email, 'O e-mail é obrigatório.');
                valido = false;
            } else if (!eEmailValido(email.value.trim())) {
                mostrarErro(email, 'Insira um e-mail válido.');
                valido = false;
            } else {
                limparErro(email);
            }

            if (!senha.value) {
                mostrarErro(senha, 'A senha é obrigatória.');
                valido = false;
            } else {
                limparErro(senha);
            }

            if (!valido) {
                e.preventDefault();
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