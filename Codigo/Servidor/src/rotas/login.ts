/*
    Rotas de login e usuários

    Autor: Sophia de Souza Fabri
*/

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../db";

const rotasLogin = Router();

// POST /login - confere o e-mail e a senha no banco de dados e devolve o usuário
rotasLogin.post("/login", async (req: Request, res: Response) => {
    // Se a requisição vier sem corpo, usa um objeto vazio para não dar erro
    const { email, senha } = req.body || {};

    // Validar campos obrigatórios
    if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são campos obrigatórios." });
    }

    let conexao;

    try {
        conexao = await getConn();

        // Consulta no banco de dados com a verificação de e-mail, senha e status ativo ('S')
        const resultado = await conexao.execute(
            `SELECT ID_USUARIO AS "id", 
                    NOME AS "nome", 
                    EMAIL AS "email", 
                    PERFIL AS "perfil", 
                    ATIVO AS "ativo"
               FROM USUARIOS 
              WHERE EMAIL = :email 
                AND SENHA = :senha 
                AND ATIVO = 'S'`,
            { email: String(email).trim(), senha: String(senha) },
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // Se não encontrou usuário ativo com essas credenciais
        if (!resultado.rows || resultado.rows.length === 0) {
            return res.status(401).json({ erro: "Credenciais inválidas." });
        }

        const usuarioEncontrado = resultado.rows[0];

        // Devolve os dados do usuário (sem a senha)
        return res.status(200).json({
            mensagem: "Login efetuado com sucesso!",
            usuario: usuarioEncontrado
        });
    } catch (erro) {
        console.error("Erro ao efetuar login:", erro);
        return res.status(500).json({ erro: "Erro ao realizar autenticação no banco de dados." });
    } finally {
        if (conexao) {
            await conexao.close();
        }
    }
});

// GET /usuarios - lista os usuários ativos pré-cadastrados, sem as senhas
rotasLogin.get("/usuarios", async (req: Request, res: Response) => {
    let conexao;

    try {
        conexao = await getConn();

        const resultado = await conexao.execute(
            `SELECT ID_USUARIO AS "id", 
                    NOME AS "nome", 
                    EMAIL AS "email", 
                    PERFIL AS "perfil", 
                    ATIVO AS "ativo"
               FROM USUARIOS 
              WHERE ATIVO = 'S'`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        return res.status(200).json(resultado.rows || []);
    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
        return res.status(500).json({ erro: "Erro ao buscar usuários no banco de dados." });
    } finally {
        if (conexao) {
            await conexao.close();
        }
    }
});

// POST /usuarios - Cadastra um novo usuário no banco de dados
rotasLogin.post("/usuarios", async (req: Request, res: Response) => {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: "Nome, e-mail e senha são obrigatórios." });
    }

    let conexao;
    try {
        conexao = await getConn();

        // Insere o novo usuário definindo ATIVO = 'S' e perfil padrão 'USER'
        await conexao.execute(
            `INSERT INTO USUARIOS (NOME, EMAIL, SENHA, PERFIL, ATIVO) 
             VALUES (:nome, :email, :senha, 'USER', 'S')`,
            { 
                nome: String(nome).trim(), 
                email: String(email).trim(), 
                senha: String(senha) 
            },
            { autoCommit: true }
        );

        return res.status(201).json({ mensagem: "Usuário cadastrado com sucesso!" });
    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);
        return res.status(500).json({ erro: "Erro ao cadastrar usuário no banco de dados." });
    } finally {
        if (conexao) {
            await conexao.close();
        }
    }
});

export default rotasLogin;
