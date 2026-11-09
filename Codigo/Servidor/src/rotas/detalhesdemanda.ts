/*
    Rotas da tela Detalhes da Demanda
    Consultas e alterações feitas diretamente no Oracle.
*/
import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../db";

const rotasDetalhesDemanda = Router();

function idValido(valor: string): number {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : 0;
}

// Busca os dados completos da demanda, projeto e responsável
rotasDetalhesDemanda.get("/:id", async (req: Request, res: Response) => {
    const id = idValido(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (!id) return res.status(400).json({ erro: "ID da demanda inválido." });

    let conn;
    try {
        conn = await getConn();
        const resultado = await conn.execute(
            `SELECT d.ID_DEMANDA AS "id",
                    d.TITULO AS "titulo",
                    d.DESCRICAO AS "descricao",
                    d.TIPO AS "tipo",
                    d.PRIORIDADE AS "prioridade",
                    d.STATUS AS "status",
                    d.ID_PROJETO AS "idProjeto",
                    p.NOME AS "projeto",
                    d.ID_RESPONSAVEL AS "idResponsavel",
                    u.NOME AS "responsavel",
                    d.PRAZO_FINALIZACAO AS "prazo",
                    d.DATA_CRIACAO AS "dataCriacao",
                    d.DATA_ATUALIZACAO AS "dataAtualizacao"
             FROM DEMANDAS d
             LEFT JOIN PROJETOS p ON p.ID_PROJETO = d.ID_PROJETO
             LEFT JOIN USUARIOS u ON u.ID_USUARIO = d.ID_RESPONSAVEL
             WHERE d.ID_DEMANDA = :id`,
            { id }
        );
        const linhas = resultado.rows as any[];
        if (!linhas || linhas.length === 0) return res.status(404).json({ erro: "Demanda não encontrada." });
        return res.json(linhas[0]);
    } catch (erro) {
        console.error("Erro ao buscar demanda:", erro);
        return res.status(500).json({ erro: "Erro ao consultar a demanda no banco de dados." });
    } finally {
        if (conn) await conn.close();
    }
});

// Lista o histórico de alterações da demanda
rotasDetalhesDemanda.get("/:id/historico", async (req: Request, res: Response) => {
    const id = idValido(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (!id) return res.status(400).json({ erro: "ID da demanda inválido." });
    let conn;
    try {
        conn = await getConn();
        const resultado = await conn.execute(
            `SELECT h.CAMPO_ALTERADO AS "campo",
                    h.VALOR_ANTERIOR AS "valorAnterior",
                    h.VALOR_NOVO AS "valorNovo",
                    h.DATA_ALTERACAO AS "dataHora",
                    u.NOME AS "nomeUsuario"
             FROM HISTORICOS h
             LEFT JOIN USUARIOS u ON u.ID_USUARIO = h.ID_USUARIO
             WHERE h.ID_DEMANDA = :id
             ORDER BY h.DATA_ALTERACAO DESC, h.ID_HISTORICO DESC`,
            { id }
        );
        return res.json(resultado.rows || []);
    } catch (erro) {
        console.error("Erro ao buscar histórico:", erro);
        return res.status(500).json({ erro: "Erro ao consultar o histórico." });
    } finally {
        if (conn) await conn.close();
    }
});

// Lista os comentários vinculados somente à demanda informada
rotasDetalhesDemanda.get("/:id/comentarios", async (req: Request, res: Response) => {
    const id = idValido(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (!id) return res.status(400).json({ erro: "ID da demanda inválido." });
    let conn;
    try {
        conn = await getConn();
        const resultado = await conn.execute(
            `SELECT c.ID_COMENTARIO AS "id",
                    c.ID_DEMANDA AS "idDemanda",
                    c.ID_USUARIO AS "idUsuario",
                    c.TEXTO AS "texto",
                    c.DATA_HORA AS "dataHora",
                    u.NOME AS "nomeUsuario"
             FROM COMENTARIOS c
             INNER JOIN USUARIOS u ON u.ID_USUARIO = c.ID_USUARIO
             WHERE c.ID_DEMANDA = :id
             ORDER BY c.DATA_HORA DESC, c.ID_COMENTARIO DESC`,
            { id }
        );
        return res.json(resultado.rows || []);
    } catch (erro) {
        console.error("Erro ao buscar comentários:", erro);
        return res.status(500).json({ erro: "Erro ao consultar os comentários." });
    } finally {
        if (conn) await conn.close();
    }
});

// Salva um comentário no Oracle
rotasDetalhesDemanda.post("/:id/comentarios", async (req: Request, res: Response) => {
    const id = idValido(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const { idUsuario, texto } = req.body || {};
    const usuarioId = Number(idUsuario);
    if (!id) return res.status(400).json({ erro: "ID da demanda inválido." });
    if (!Number.isInteger(usuarioId) || usuarioId <= 0) return res.status(400).json({ erro: "Faça login para comentar." });
    if (typeof texto !== "string" || !texto.trim()) return res.status(400).json({ erro: "Digite um comentário." });

    let conn;
    try {
        conn = await getConn();
        const demanda = await conn.execute(`SELECT ID_DEMANDA FROM DEMANDAS WHERE ID_DEMANDA = :id`, { id });
        if (!demanda.rows || demanda.rows.length === 0) return res.status(404).json({ erro: "Demanda não encontrada." });

        const usuario = await conn.execute(`SELECT NOME FROM USUARIOS WHERE ID_USUARIO = :usuarioId AND ATIVO = 'S'`, { usuarioId });
        if (!usuario.rows || usuario.rows.length === 0) return res.status(400).json({ erro: "Usuário não encontrado ou inativo." });

        const idOut = { dir: oracledb.BIND_OUT, type: oracledb.NUMBER };
        const insercao = await conn.execute(
            `INSERT INTO COMENTARIOS (TEXTO, ID_DEMANDA, ID_USUARIO)
             VALUES (:texto, :id, :usuarioId)
             RETURNING ID_COMENTARIO INTO :idComentario`,
            { texto: texto.trim(), id, usuarioId, idComentario: idOut },
            { autoCommit: true }
        );
        const novoId = (insercao.outBinds as any).idComentario[0];
        const novoComentario = await conn.execute(
            `SELECT c.ID_COMENTARIO AS "id", c.ID_DEMANDA AS "idDemanda",
                    c.ID_USUARIO AS "idUsuario", c.TEXTO AS "texto",
                    c.DATA_HORA AS "dataHora", u.NOME AS "nomeUsuario"
             FROM COMENTARIOS c JOIN USUARIOS u ON u.ID_USUARIO = c.ID_USUARIO
             WHERE c.ID_COMENTARIO = :novoId`,
            { novoId }
        );
        return res.status(201).json((novoComentario.rows as any[])[0]);
    } catch (erro) {
        console.error("Erro ao salvar comentário:", erro);
        return res.status(500).json({ erro: "Não foi possível salvar o comentário no banco." });
    } finally {
        if (conn) await conn.close();
    }
});

// Atualiza campos da demanda e grava cada mudança na tabela HISTORICOS
rotasDetalhesDemanda.put("/:id", async (req: Request, res: Response) => {
    const id = idValido(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    const corpo = req.body || {};
    const usuarioId = Number(corpo.idUsuario);
    if (!id) return res.status(400).json({ erro: "ID da demanda inválido." });
    if (!Number.isInteger(usuarioId) || usuarioId <= 0) return res.status(400).json({ erro: "Faça login novamente para salvar alterações." });

    const statusPermitidos = ["Aberta", "Em andamento", "Em revisao", "Concluida", "Cancelada"];
    const tipoPermitidos = ["Tarefa", "Defeito", "Melhoria", "Documentacao"];
    const prioridadePermitidas = ["Critica", "Alta", "Media", "Baixa"];

    let conn;
    try {
        conn = await getConn();
        const atual = await conn.execute(
            `SELECT TITULO AS "titulo", TIPO AS "tipo", PRIORIDADE AS "prioridade",
                    STATUS AS "status", ID_PROJETO AS "idProjeto",
                    ID_RESPONSAVEL AS "idResponsavel", PRAZO_FINALIZACAO AS "prazo"
             FROM DEMANDAS WHERE ID_DEMANDA = :id FOR UPDATE`,
            { id }
        );
        if (!atual.rows || atual.rows.length === 0) return res.status(404).json({ erro: "Demanda não encontrada." });
        const antigo = (atual.rows as any[])[0];

        let projetoId = antigo.idProjeto;
        if (corpo.projeto !== undefined) {
            const projetoEncontrado = await conn.execute(
                `SELECT ID_PROJETO FROM PROJETOS WHERE ID_PROJETO = :valor OR LOWER(NOME) = LOWER(:nome)`,
                { valor: Number(corpo.projeto) || -1, nome: String(corpo.projeto).trim() }
            );
            if (!projetoEncontrado.rows || projetoEncontrado.rows.length === 0) {
                return res.status(400).json({ erro: "Projeto não encontrado. Informe um projeto válido." });
            }
            projetoId = (projetoEncontrado.rows[0] as any).ID_PROJETO;
        }

        let responsavelId: number | null = antigo.idResponsavel;
        if (corpo.responsavel !== undefined) {
            if (corpo.responsavel === "" || corpo.responsavel === null || corpo.responsavel === "Não definido") {
                responsavelId = null;
            } else {
                const responsavelEncontrado = await conn.execute(
                    `SELECT ID_USUARIO FROM USUARIOS WHERE ID_USUARIO = :valor OR LOWER(NOME) = LOWER(:nome)`,
                    { valor: Number(corpo.responsavel) || -1, nome: String(corpo.responsavel).trim() }
                );
                if (!responsavelEncontrado.rows || responsavelEncontrado.rows.length === 0) {
                    return res.status(400).json({ erro: "Responsável não encontrado. Informe um usuário válido." });
                }
                responsavelId = (responsavelEncontrado.rows[0] as any).ID_USUARIO;
            }
        }

        if (corpo.status !== undefined && !statusPermitidos.includes(corpo.status)) return res.status(400).json({ erro: "Status inválido." });
        if (corpo.tipo !== undefined && !tipoPermitidos.includes(corpo.tipo)) return res.status(400).json({ erro: "Tipo inválido." });
        if (corpo.prioridade !== undefined && !prioridadePermitidas.includes(corpo.prioridade)) return res.status(400).json({ erro: "Prioridade inválida." });
        if (corpo.titulo !== undefined && (typeof corpo.titulo !== "string" || !corpo.titulo.trim())) return res.status(400).json({ erro: "O título é obrigatório." });

        if (responsavelId !== null) {
            if (!Number.isInteger(responsavelId)) return res.status(400).json({ erro: "Responsável inválido." });
        }

        const prazo = corpo.prazo !== undefined && corpo.prazo !== "" ? new Date(corpo.prazo) : null;
        if (corpo.prazo !== undefined && corpo.prazo !== "" && isNaN(prazo!.getTime())) return res.status(400).json({ erro: "Prazo inválido." });

        const novo = {
            titulo: corpo.titulo !== undefined ? corpo.titulo.trim() : antigo.titulo,
            tipo: corpo.tipo !== undefined ? corpo.tipo : antigo.tipo,
            prioridade: corpo.prioridade !== undefined ? corpo.prioridade : antigo.prioridade,
            status: corpo.status !== undefined ? corpo.status : antigo.status,
            idProjeto: projetoId,
            idResponsavel: responsavelId,
            prazo: corpo.prazo !== undefined ? prazo : antigo.prazo
        };

        const alteracoes: [string, any, any][] = [
            ["Título", antigo.titulo, novo.titulo],
            ["Tipo", antigo.tipo, novo.tipo],
            ["Prioridade", antigo.prioridade, novo.prioridade],
            ["Status", antigo.status, novo.status],
            ["Projeto", antigo.idProjeto, novo.idProjeto],
            ["Responsável", antigo.idResponsavel, novo.idResponsavel],
            ["Prazo", antigo.prazo, novo.prazo]
        ];

        await conn.execute(
            `UPDATE DEMANDAS SET TITULO = :titulo, TIPO = :tipo, PRIORIDADE = :prioridade,
             STATUS = :status, ID_PROJETO = :idProjeto, ID_RESPONSAVEL = :idResponsavel,
             PRAZO_FINALIZACAO = :prazo, DATA_ATUALIZACAO = SYSDATE
             WHERE ID_DEMANDA = :id`,
            { ...novo, id }
        );

        for (const [campo, valorAntigo, valorNovo] of alteracoes) {
            const antigoTexto = valorAntigo instanceof Date ? valorAntigo.toISOString().slice(0, 10) : String(valorAntigo ?? "");
            const novoTexto = valorNovo instanceof Date ? valorNovo.toISOString().slice(0, 10) : String(valorNovo ?? "");
            if (antigoTexto !== novoTexto) {
                await conn.execute(
                    `INSERT INTO HISTORICOS (CAMPO_ALTERADO, VALOR_ANTERIOR, VALOR_NOVO, ID_DEMANDA, ID_USUARIO)
                     VALUES (:campo, :valorAntigo, :valorNovo, :id, :usuarioId)`,
                    { campo, valorAntigo: antigoTexto || null, valorNovo: novoTexto || null, id, usuarioId }
                );
            }
        }
        await conn.commit();
        return res.json({ mensagem: "Demanda atualizada com sucesso." });
    } catch (erro) {
        if (conn) await conn.rollback();
        console.error("Erro ao atualizar demanda:", erro);
        return res.status(500).json({ erro: "Não foi possível atualizar a demanda no banco." });
    } finally {
        if (conn) await conn.close();
    }
});

export default rotasDetalhesDemanda;
