/*
    Rotas de projetos

    Autor: Pedro Tafner
*/

import { Router, Request, Response } from "express";
import { getConn } from "../db";

const rotasProjetos = Router();

// GET /projetos - lista os projetos ativos cadastrados no banco
// Filtro opcional: GET /projetos?idUsuario=2 devolve só os projetos que esse usuário pode ver
// (o Administrador vê todos; Líder de Projeto e Membro da Equipe só os projetos aos quais estão vinculados)
rotasProjetos.get("/", async (req: Request, res: Response) => {
    const idUsuarioTexto = req.query.idUsuario;
    let idUsuario: number | null = null;

    //Validar id do usuário (só se ele foi enviado)
    if (idUsuarioTexto !== undefined) {
        idUsuario = Number(idUsuarioTexto);

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            res.status(400).json({ erro: "O id do usuário deve ser um número inteiro." });
            return;
        }
    }

    let conexao;

    try {
        // Pega uma conexão emprestada do pool
        conexao = await getConn();

        // Por padrão (sem filtro ou para o Administrador) lista todos os projetos ativos
        let somenteVinculados = false;

        if (idUsuario !== null) {
            const usuario = await conexao.execute<{ PERFIL: string }>(
                `SELECT PERFIL FROM USUARIOS WHERE ID_USUARIO = :id AND ATIVO = 'S'`,
                { id: idUsuario }
            );

            if (!usuario.rows || usuario.rows.length === 0) {
                res.status(404).json({ erro: "Usuário não encontrado." });
                return;
            }

            somenteVinculados = usuario.rows[0].PERFIL !== "Administrador";
        }

        // Os apelidos entre aspas ("id", "nome") fazem o JSON sair com esses nomes
        const resultado = somenteVinculados
            ? await conexao.execute(
                `SELECT P.ID_PROJETO AS "id", P.NOME AS "nome", P.DESCRICAO AS "descricao"
                   FROM PROJETOS P
                   JOIN PROJETO_USUARIO PU ON PU.ID_PROJETO = P.ID_PROJETO
                  WHERE P.ATIVO = 'S'
                    AND PU.ID_USUARIO = :idUsuario
                  ORDER BY P.NOME`,
                { idUsuario: idUsuario }
            )
            : await conexao.execute(
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
