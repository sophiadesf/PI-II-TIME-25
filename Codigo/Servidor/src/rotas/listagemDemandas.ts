// Autoria: João Felipe

import express, { Request, Response } from "express";
import { getConn } from "../db"; // Importa a função que pega a conexão do pool

const router = express.Router();

const normalizarArray = (param: any): string[] => {
    if (!param) return [];
    if (Array.isArray(param)) return param.map(String);
    // Transforma strings separadas por vírgula em array real
    if (typeof param === 'string') return param.split(',');
    return [String(param)];
};

// GET /demandas 
router.get("/", async (req: Request, res: Response) => {
    const statusArray = normalizarArray(req.query.status);
    const prioridadeArray = normalizarArray(req.query.prioridade);
    const tipoArray = normalizarArray(req.query.tipo);
    const busca = req.query.busca ? String(req.query.busca).trim() : "";

    const totalFiltros = statusArray.length + prioridadeArray.length + tipoArray.length;
    
    if (totalFiltros === 1) {
        return res.status(400).json({ error: "É necessário informar pelo menos dois critérios de busca" });
    }
    if (busca && busca.length > 0 && busca.length < 3) {
        return res.status(400).json({ error: "A busca deve ter no mínimo 3 caracteres" });
    }

    let conn;
    try {
        conn = await getConn(); // Pega a conexão do Oracle

        let baseQuery = `SELECT id_demanda AS id, titulo, descricao, tipo, prioridade, id_responsavel AS responsavel, status FROM demandas`;
        const condicoes: string[] = [];
        const bindParams: any[] = [];
        let bindIndex = 1; // Contador para os marcadores do Oracle (:1, :2, etc)

        // Função auxiliar para montar os IN clauses (:1, :2, :3) dinamicamente
        const adicionarFiltro = (campoDb: string, arrayValores: string[]) => {
            if (arrayValores.length > 0) {
                const marcadores = arrayValores.map(() => `:${bindIndex++}`).join(',');
                condicoes.push(`LOWER(${campoDb}) IN (${marcadores})`);
                bindParams.push(...arrayValores.map(v => v.toLowerCase()));
            }
        };

        if (totalFiltros >= 2) {
            adicionarFiltro('status', statusArray);
            adicionarFiltro('prioridade', prioridadeArray);
            adicionarFiltro('tipo', tipoArray);
        }

        if (busca) {
            // Busca parcial no título OU descrição (ignorando maiúsculas/minúsculas)
            condicoes.push(`(LOWER(titulo) LIKE LOWER('%' || :${bindIndex} || '%') OR LOWER(descricao) LIKE LOWER('%' || :${bindIndex+1} || '%'))`);
            bindParams.push(busca, busca);
            bindIndex += 2;
        }

        // Se houver condições, adiciona o WHERE na query
        if (condicoes.length > 0) {
            baseQuery += ' WHERE ' + condicoes.join(' AND ');
        }
        
        // Adiciona ordenação padrão
        baseQuery += ' ORDER BY id DESC';

        // Executa
        const result = await conn.execute(baseQuery, bindParams);
        
        // Retorna as linhas (o OUT_FORMAT_OBJECT no db.ts garante que venha como JSON/Objeto)
        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("Erro ao buscar demandas:", error);
        return res.status(500).json({ error: "Erro interno ao consultar o banco de dados." });
    } finally {
        if (conn) {
            try {
                await conn.close(); // Devolve a conexão pro pool
            } catch (err) {
                console.error("Erro ao fechar conexão:", err);
            }
        }
    }
});

// GET /demandas/:id
router.get("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido." });

    let conn;
    try {
        conn = await getConn();
        const result = await conn.execute(
            `SELECT * FROM demandas WHERE id = :1`,
            [id]
        );

        if (result.rows && result.rows.length > 0) {
            return res.status(200).json(result.rows[0]);
        } else {
            return res.status(404).json({ error: "Demanda não encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Erro ao consultar banco de dados." });
    } finally {
        if (conn) await conn.close();
    }
});

export default router;