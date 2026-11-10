
/*
    Rotas do dashboard (resumo das demandas)

    Autor: Sophia Dalla Bernardina Lopes

    Arquivo responsável por consultar os indicadores do Dashboard diretamente no banco de dados
*/

import { Router, Request, Response } from "express";
import { getConn } from "../db";

const rotasDashboard = Router();

// GET /dashboard?periodo=7, 30 ou 90
rotasDashboard.get("/", async (req: Request, res: Response) => {
    let conexao;
    try {
        const periodoRecebido = Number(req.query.periodo || 30);
        const periodo = [7, 30, 90].includes(periodoRecebido) ? periodoRecebido : 30;

        conexao = await getConn();

        // =====================================================
        // 1. CONSULTA DOS INDICADORES GERAIS
        // =====================================================

        const resultadoIndicadores = await conexao.execute(
            `SELECT
                COUNT(CASE WHEN DATA_CRIACAO >= TRUNC(SYSDATE) - :periodo + 1 THEN 1 END) AS ABERTAS,
                COUNT(CASE WHEN STATUS = 'Em andamento' THEN 1 END) AS DESENVOLVIMENTO,
                COUNT(CASE WHEN STATUS = 'Em revisao' THEN 1 END) AS ANALISE,
                COUNT(CASE WHEN STATUS = 'Concluida' AND DATA_ATUALIZACAO >= TRUNC(SYSDATE) - :periodo + 1 AND DATA_ATUALIZACAO < TRUNC(SYSDATE) + 1 THEN 1 END) AS TOTAL_CONCLUIDAS,
                COUNT(CASE WHEN STATUS = 'Concluida' AND PRAZO_FINALIZACAO IS NOT NULL AND DATA_ATUALIZACAO >= TRUNC(SYSDATE) - :periodo + 1 AND DATA_ATUALIZACAO < TRUNC(SYSDATE) + 1 AND DATA_ATUALIZACAO <= PRAZO_FINALIZACAO THEN 1 END) AS CONCLUIDAS_NO_PRAZO,
                COUNT(CASE WHEN STATUS IN ('Aberta', 'Em andamento', 'Em revisao') THEN 1 END) AS ATIVAS
                FROM DEMANDAS`,{periodo}, {outFormat: 4002}
        );

        const indicadores = resultadoIndicadores.rows?.[0] as any;

        // Calcula a aderência considerando as demandas concluídas no período que possuem prazo de finalização definido.
        const totalConcluidas = Number(indicadores.TOTAL_CONCLUIDAS || 0);
        const concluidasNoPrazo = Number(indicadores.CONCLUIDAS_NO_PRAZO || 0);

        const aderencia = totalConcluidas > 0 ? Math.round((concluidasNoPrazo / totalConcluidas) * 100) : 0;

        // =====================================================
        // 2. CONSULTA DO FLUXO DAS ÚLTIMAS 8 SEMANAS
        // =====================================================
        const resultadoFluxo = await conexao.execute(
            `
            WITH SEMANAS AS (SELECT TRUNC(SYSDATE, 'IW') - (7 * (LEVEL - 1)) AS INICIO FROM DUAL CONNECT BY LEVEL <= 8),
            ABERTAS AS (SELECT TRUNC(DATA_CRIACAO, 'IW') AS SEMANA, COUNT(*) AS TOTAL FROM DEMANDAS WHERE DATA_CRIACAO >= TRUNC(SYSDATE, 'IW') - 49 GROUP BY TRUNC(DATA_CRIACAO, 'IW')),
            CONCLUIDAS AS (SELECT TRUNC(DATA_ATUALIZACAO, 'IW') AS SEMANA, COUNT(*) AS TOTAL FROM DEMANDAS WHERE STATUS = 'Concluida' AND DATA_ATUALIZACAO >= TRUNC(SYSDATE, 'IW') - 49 GROUP BY TRUNC(DATA_ATUALIZACAO, 'IW'))
            SELECT TO_CHAR(S.INICIO, 'DD/MM') AS SEMANA, NVL(A.TOTAL, 0) AS ABERTAS, NVL(C.TOTAL, 0) AS CONCLUIDAS
            FROM SEMANAS S
            LEFT JOIN ABERTAS A ON A.SEMANA = S.INICIO
            LEFT JOIN CONCLUIDAS C ON C.SEMANA = S.INICIO
            ORDER BY S.INICIO`, [],
        {outFormat: 4002});

        // =====================================================
        // 3. CONSULTA DA DISTRIBUIÇÃO POR STATUS
        // =====================================================
        const resultadoDistribuicao = await conexao.execute(
            `
            SELECT STATUS, COUNT(*) AS TOTAL
            FROM DEMANDAS
            GROUP BY STATUS
            ORDER BY STATUS
            `, [], { outFormat: 4002 }
        );

        // =====================================================
        // 4. CONSULTA DAS DEMANDAS MAIS RECENTES
        // =====================================================

        const resultadoRecentes = await conexao.execute(
            `
            SELECT D.ID_DEMANDA, D.TITULO, D.STATUS, D.PRIORIDADE, NVL(U.NOME, 'Não atribuído') AS RESPONSAVEL
            FROM DEMANDAS D
            LEFT JOIN USUARIOS U ON D.ID_RESPONSAVEL = U.ID_USUARIO ORDER BY D.DATA_CRIACAO DESC, D.ID_DEMANDA DESC FETCH FIRST 5 ROWS ONLY `,
            [],
            {outFormat: 4002}
        );

        // =====================================================
        // 5. RETORNO DOS DADOS PARA O FRONTEND
        // =====================================================
        res.status(200).json({
            periodo: periodo,
            indicadores: {
                abertas: Number(indicadores.ABERTAS || 0),
                desenvolvimento: Number(indicadores.DESENVOLVIMENTO || 0),
                analise: Number(indicadores.ANALISE || 0),
                aderencia: aderencia,
                ativas: Number(indicadores.ATIVAS || 0)
            },
            fluxo: resultadoFluxo.rows,
            distribuicao: resultadoDistribuicao.rows,
            recentes: resultadoRecentes.rows
        });
    } catch (erro) {
        console.error("Erro ao consultar o Dashboard:", erro);
        res.status(500).json({erro: "Não foi possível carregar os indicadores do Dashboard."});
    } finally {
        if (conexao) {
            await conexao.close();
        }
    }
});

// Impede métodos diferentes de GET na rota do Dashboard.
rotasDashboard.all("/", (req: Request, res: Response) => {
    res.set("Allow", "GET, HEAD");
    res.status(405).json({
        erro: "Método não permitido. Utilize GET /dashboard."
    });
});

export default rotasDashboard;
