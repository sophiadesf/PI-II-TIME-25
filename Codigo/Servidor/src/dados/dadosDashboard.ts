/*
    Dados de teste adicionais para o dashboard

    Autor: Sophia Dalla Bernardita Lopes
*/

import { Demanda } from "./dados";

// Demandas para testar os status "Em revisão" e "Cancelada",
// as críticas em aberto e as próximas do prazo
export const demandasDashboard: Demanda[] = [
    {
        id: 7,
        titulo: "Revisar melhorias do portal",
        descricao: "Revisar as alterações da interface antes da entrega.",
        tipo: "Melhoria",
        prioridade: "Alta",
        status: "Em revisão",
        idProjeto: 1,
        idResponsavel: 2,
        prazo: "2026-10-16",
        dataCriacao: "2026-10-09T10:00:00.000Z",
        dataAtualizacao: "2026-10-11T14:00:00.000Z"
    },
    {
        id: 8,
        titulo: "Corrigir erro já descartado",
        descricao: "Demanda cancelada, mantida no histórico para consulta.",
        tipo: "Defeito",
        prioridade: "Baixa",
        status: "Cancelada",
        idProjeto: 3,
        idResponsavel: null,
        prazo: "2026-10-14",
        dataCriacao: "2026-10-08T09:00:00.000Z",
        dataAtualizacao: "2026-10-10T09:00:00.000Z"
    },
    {
        id: 9,
        titulo: "Corrigir falha no envio de pedidos",
        descricao: "Falha crítica identificada na transmissão de pedidos.",
        tipo: "Tarefa",
        prioridade: "Crítica",
        status: "Em andamento",
        idProjeto: 2,
        idResponsavel: 3,
        prazo: "2026-10-17",
        dataCriacao: "2026-10-10T09:00:00.000Z",
        dataAtualizacao: "2026-10-11T09:00:00.000Z"
    }
];
