/*
    Rotas de projetos

    Autor: Pedro Tafner
*/

import { Router, Request, Response } from "express";
import { getConn } from "../db";

const rotasProjetos = Router();

// GET /projetos - lista os projetos ativos cadastrados no banco
rotasProjetos.get("/", async (req: Request, res: Response) => {
    let conexao;

    try {
        // Pega uma conexão emprestada do pool
        conexao = await getConn();

        // Os apelidos entre aspas ("id", "nome") fazem o JSON sair com esses nomes
        const resultado = await conexao.execute(
            `SELECT ID_PROJETO AS "id", NOME AS "nome", DESCRICAO AS "descricao"
               FROM PROJETOS
              WHERE ATIVO = 'S'
              ORDER BY NOME`
        );

        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao listar projetos:", erro);
        res.status(500).json({ erro: "Erro ao consultar os projetos no banco de dados." });
    } finally {
        // Devolve a conexão para o pool (mesmo se der erro)
        if (conexao) {
            await conexao.close();
        }
    }
});

// GET /projetos/:id/usuarios - lista os usuários que participam do projeto
// (usado na tela de cadastro para escolher o responsável da demanda)
rotasProjetos.get("/:id/usuarios", async (req: Request, res: Response) => {
    const idProjeto = Number(req.params.id);

    //Validar id do projeto
    if (!Number.isInteger(idProjeto) || idProjeto <= 0) {
        res.status(400).json({ erro: "O id do projeto deve ser um número inteiro." });
        return;
    }

    let conexao;

    try {
        conexao = await getConn();

        // O :idProjeto é preenchido pelo valor do segundo parâmetro (evita SQL Injection)
        const resultado = await conexao.execute(
            `SELECT U.ID_USUARIO AS "id", U.NOME AS "nome", U.PERFIL AS "perfil"
               FROM USUARIOS U
               JOIN PROJETO_USUARIO PU ON PU.ID_USUARIO = U.ID_USUARIO
              WHERE PU.ID_PROJETO = :idProjeto
                AND U.ATIVO = 'S'
              ORDER BY U.NOME`,
            { idProjeto: idProjeto }
        );

        res.status(200).json(resultado.rows);
    } catch (erro) {
        console.error("Erro ao listar usuários do projeto:", erro);
        res.status(500).json({ erro: "Erro ao consultar os usuários do projeto no banco de dados." });
    } finally {
        if (conexao) {
            await conexao.close();
        }
    }
});

export default rotasProjetos;
