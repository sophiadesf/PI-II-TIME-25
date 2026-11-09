/*
    Rotas de login e usuários

    Autor: Sophia de Souza Fabri
*/

import { Router, Request, Response } from "express";
import { usuarios, Usuario } from "../dados/dados";

const rotasLogin = Router();

// Função auxiliar (helper) que devolve uma cópia do usuário sem o campo senha
const removerSenha = (usuario: Usuario) => {
    const { senha, ...usuarioSemSenha } = usuario;
    return usuarioSemSenha;
};

// POST /login - confere o e-mail e a senha e devolve o usuário com o seu perfil
rotasLogin.post("/login", (req: Request, res: Response) => {
    // Se a requisição vier sem corpo, usa um objeto vazio para não dar erro
    const { email, senha } = req.body || {};

    //Validar campos obrigatórios
    if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são campos obrigatórios." });
    }

    // Procura um usuário com o mesmo e-mail e a mesma senha
    const usuarioEncontrado = usuarios.find(
        (usuario) => usuario.email === email && usuario.senha === senha
    );

    //Validar credenciais
    if (!usuarioEncontrado) {
        return res.status(401).json({ erro: "Credenciais inválidas." });
    }

    // Devolve os dados do usuário e o perfil, sem a senha
    return res.status(200).json({
        mensagem: "Login efetuado com sucesso!",
        usuario: removerSenha(usuarioEncontrado)
    });
});

// GET /usuarios - lista os usuários pré-cadastrados, sem as senhas
rotasLogin.get("/usuarios", (req: Request, res: Response) => {
    const listaSemSenhas = usuarios.map((usuario) => removerSenha(usuario));

    return res.status(200).json(listaSemSenhas);
});

export default rotasLogin;
