const express = require('express');
const cors = require('cors'); // <--- Adicionado aqui no topo
const app = express();

app.use(cors()); // <--- Ativado antes de todas as rotas
app.use(express.json());

// Dados de teste (simulando um banco de dados de usuários) - Feito por Sophia Fabri
const usuarios = [
  {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana.silva@exemplo.com',
    senha: 'Senha123@',
    perfil: 'ADMIN'
  },
  {
    id: 2,
    nome: 'Carlos Santos',
    email: 'carlos.santos@exemplo.com',
    senha: 'Senha456@',
    perfil: 'USUARIO'
  }
];

// Helper para remover o campo de senha do objeto retornado
const removerSenha = (usuario) => {
  const { senha, ...usuarioSemSenha } = usuario;
  return usuarioSemSenha;
};

// ----------------------------------------------------
// POST /login
// ----------------------------------------------------
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Valida campos obrigatórios ausentes
  if (!email || !senha) {
    return res.status(400).json({
      erro: 'E-mail e senha são campos obrigatórios.'
    });
  }

  // Busca o usuário correspondente
  const usuarioEncontrado = usuarios.find(
    (user) => user.email === email && user.senha === senha
  );

  // Valida credenciais incorretas
  if (!usuarioEncontrado) {
    return res.status(401).json({
      erro: 'Credenciais inválidas.'
    });
  }

  // Retorna os dados do usuário e perfil sem a senha
  return res.status(200).json({
    mensagem: 'Login efetuado com sucesso!',
    usuario: removerSenha(usuarioEncontrado)
  });
});

// ----------------------------------------------------
// GET /usuarios
// ----------------------------------------------------
app.get('/usuarios', (req, res) => {
  // Retorna lista de usuários cadastrados ocultando as senhas
  const listaSemSenhas = usuarios.map((user) => removerSenha(user));
  
  return res.status(200).json(listaSemSenhas);
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});