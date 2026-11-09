/*
    Dados de teste adicionais para a listagem de demandas

    Autor: João Felipe Bodo Pinheiro
*/

import { Projeto, Usuario, Demanda } from "./dados";

// Projeto extra para testar o filtro e a ordenação da listagem
export const projetosListagem: Projeto[] = [
    { id: 4, nome: "Sistema Web" }
];

// Usuário extra (Membro da Equipe) para variar os responsáveis
export const usuariosListagem: Usuario[] = [
    { id: 4, nome: "Carlos Pinheiro", email: "carlos@empresa.com", senha: "Membro@123", perfil: "Membro da Equipe" }
];

// Demandas extras com tipos, prioridades e status variados
export const demandasListagem: Demanda[] = [
    {
        id: 4,
        titulo: "Corrigir login com caracteres especiais",
        descricao: "Usuário não consegue logar quando a senha tem caracteres especiais.",
        tipo: "Defeito",
        prioridade: "Alta",
        status: "Aberta",
        idProjeto: 4,
        idResponsavel: 4,
        prazo: "2026-10-15",
        dataCriacao: "2026-10-10T11:00:00.000Z",
        dataAtualizacao: "2026-10-12T15:00:00.000Z"
    },
    {
        id: 5,
        titulo: "Criar tela de dashboard",
        descricao: "Desenvolver a interface gráfica inicial do painel de indicadores.",
        tipo: "Tarefa",
        prioridade: "Média",
        status: "Em andamento",
        idProjeto: 2,
        idResponsavel: 1,
        prazo: null,
        dataCriacao: "2026-10-11T08:30:00.000Z",
        dataAtualizacao: "2026-10-12T17:00:00.000Z"
    },
    {
        id: 6,
        titulo: "Atualizar documentação da API",
        descricao: "Adicionar os endpoints de GET e POST no README.",
        tipo: "Documentação",
        prioridade: "Baixa",
        status: "Concluída",
        idProjeto: 4,
        idResponsavel: 4,
        prazo: null,
        dataCriacao: "2026-10-01T13:00:00.000Z",
        dataAtualizacao: "2026-10-05T16:00:00.000Z"
    }
];
