/*
    Dados de teste

    Autor: Pedro Tafner e Joao Felipe
    (Adicionais Dashboard) / Autoria: Sophia D B Lopes
*/

// Formato de um projeto
export interface Projeto {
    id: number;
    nome: string;
}

// Formato de um usuário
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    senha: string;
    perfil: string; // Administrador, Líder de Projeto ou Membro da Equipe
}

// Formato de uma demanda
export interface Demanda {
    id: number;
    titulo: string;
    descricao: string;
    tipo: string;
    prioridade: string;
    status: string;
    idProjeto: number;
    idResponsavel: number | null; // null quando não tiver responsável
    prazo: string | null;         // formato AAAA-MM-DD, null quando não tiver prazo
    dataCriacao: string;
    dataAtualizacao: string;
}

export const projetos: Projeto[] = [
    { id: 1, nome: "Portal do Cliente" },
    { id: 2, nome: "Aplicativo Mobile" },
    { id: 3, nome: "Sistema Financeiro" },
    { id: 4, nome: "Sistema Web" }
];

export const usuarios: Usuario[] = [
    { id: 1, nome: "Ana Souza", email: "ana@empresa.com", senha: "Admin@123", perfil: "Administrador" },
    { id: 2, nome: "Bruno Lima", email: "bruno@empresa.com", senha: "Lider@123", perfil: "Líder de Projeto" },
    { id: 3, nome: "Carla Mendes", email: "carla@empresa.com", senha: "Membro@123", perfil: "Membro da Equipe" },
    { id: 4, nome: "Carlos Pinheiro", email: "carlos@empresa.com", senha: "Membro@123", perfil: "Membro da Equipe" }
];

export const demandas: Demanda[] = [
    {
        id: 1,
        titulo: "Corrigir erro no login",
        descricao: "Usuários não conseguem entrar quando o e-mail tem letras maiúsculas.",
        tipo: "Defeito",
        prioridade: "Crítica",
        status: "Aberta",
        idProjeto: 1,
        idResponsavel: 3,
        prazo: "2026-10-20",
        dataCriacao: "2026-10-01T09:00:00.000Z",
        dataAtualizacao: "2026-10-01T09:00:00.000Z"
    },
    {
        id: 2,
        titulo: "Criar tela de relatórios",
        descricao: "Tela para exibir os relatórios mensais de vendas.",
        tipo: "Tarefa",
        prioridade: "Média",
        status: "Em andamento",
        idProjeto: 3,
        idResponsavel: 2,
        prazo: "2026-11-15",
        dataCriacao: "2026-09-20T14:30:00.000Z",
        dataAtualizacao: "2026-10-05T10:00:00.000Z"
    },
    {
        id: 3,
        titulo: "Documentar API de pagamentos",
        descricao: "Escrever a documentação das rotas de pagamento.",
        tipo: "Documentação",
        prioridade: "Baixa",
        status: "Aberta",
        idProjeto: 2,
        idResponsavel: 1,
        prazo: null,
        dataCriacao: "2026-10-08T16:00:00.000Z",
        dataAtualizacao: "2026-10-08T16:00:00.000Z"
    },
    {
        id: 4,
        titulo: "Corrigir erro no login",
        descricao: "Usuário não consegue logar quando a senha tem caracteres especiais.",
        tipo: "Defeito",
        prioridade: "Alta",
        status: "Aberta",
        idProjeto: 4,
        idResponsavel: 4,
        prazo: "2026-10-15",
        dataCriacao: "2026-10-10",
        dataAtualizacao: "2026-10-15"
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
        dataCriacao: "2026-10-11",
        dataAtualizacao: "2026-10-20"
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
        dataCriacao: "2026-10-01",
        dataAtualizacao: "2026-10-05"
    },

    // Exemplos adicionais para testar o Dashboard (Reunião 4)
    // AUTORIA: Sophia D B Lopes
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
