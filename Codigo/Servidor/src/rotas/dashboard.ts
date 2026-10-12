/*
    Rota do Dashboard - resumo das demandas
    AUTORIA: Sophia D B Lopes
    PROJETO: Sistema de Acompanhamento de Demandas de Desenvolvimento
*/

import { Router, Request, Response } from "express";
import { demandas } from "../dados/dados";

const rotasDashboard = Router();

// Status que representam demandas ainda nao finalizadas
const statusEmAberto = ["Aberta", "Em andamento", "Em revisão"];

// Converte uma data para AAAA-MM-DD, desconsiderando o horário.
function formatarData(data: Date): string {
    const ano = data.getFullYear();
    const mes = ("0" + (data.getMonth() + 1)).slice(-2);
    const dia = ("0" + data.getDate()).slice(-2);
    return `${ano}-${mes}-${dia}`;
}

// GET /dashboard - consulta os dados 
rotasDashboard.get("/", (req: Request, res: Response) => {
    // Inicializa as categorias
    const porStatus: Record<string, number> = {
        "Aberta": 0,
        "Em andamento": 0,
        "Em revisão": 0,
        "Concluída": 0,
        "Cancelada": 0
    };

    const porPrioridade: Record<string, number> = {
        "Crítica": 0,
        "Alta": 0,
        "Média": 0,
        "Baixa": 0
    };

    const porTipo: Record<string, number> = {
        "Tarefa": 0,
        "Defeito": 0,
        "Melhoria": 0,
        "Documentação": 0
    };

    // Conta as demandas por status, prioridade e tipo
    for (const demanda of demandas) {
        if (porStatus[demanda.status] !== undefined) {
            porStatus[demanda.status]++;
        }
        if (porPrioridade[demanda.prioridade] !== undefined) {
            porPrioridade[demanda.prioridade]++;
        }
        if (porTipo[demanda.tipo] !== undefined) {
            porTipo[demanda.tipo]++;
        }
    }

    // Em aberto: demandas com status aberta, em andamento ou em revisão.
    const criticasEmAberto = demandas.filter((demanda) => {
        return demanda.prioridade === "Crítica" && statusEmAberto.includes(demanda.status);
    });

    // proximas do prazo: demandas em aberto que vencem de hoje até 7 dias depois.
    // demandas vencidas, concluídas, canceladas ou sem prazo não entram na lista.
    const hoje = new Date();
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7);
    const dataHoje = formatarData(hoje);
    const dataLimite = formatarData(ultimoDia);

    const proximasDoPrazo = demandas.filter((demanda) => {
        return statusEmAberto.includes(demanda.status) && demanda.prazo !== null && demanda.prazo >= dataHoje && demanda.prazo <= dataLimite;
    }).sort((primeira, segunda) => {
        return String(primeira.prazo).localeCompare(String(segunda.prazo));
    });

    res.status(200).json({
        totalDemandas: demandas.length,
        porStatus: porStatus,
        porPrioridade: porPrioridade,
        porTipo: porTipo,
        criticasEmAberto: criticasEmAberto,
        proximasDoPrazo: proximasDoPrazo,
        criterios: {
            emAberto: "Aberta, Em andamento e Em revisão",
            proximasDoPrazo: "Demandas em aberto com prazo entre hoje e os próximos 7 dias"
        }
    });
});

// exemplo de erro para demonstrar um método nao permitido
rotasDashboard.all("/", (req: Request, res: Response) => {
    res.set("Allow", "GET, HEAD");
    res.status(405).json({ erro: "Método não permitido. Utilize GET /dashboard." });
});

export default rotasDashboard;
