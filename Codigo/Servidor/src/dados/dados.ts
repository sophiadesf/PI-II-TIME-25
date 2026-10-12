/*
    Dados de teste

    Autor: Pedro Tafner

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
    { id: 3, nome: "Sistema Financeiro" }
];

export const usuarios: Usuario[] = [
    { id: 1, nome: "Ana Souza", email: "ana@empresa.com", senha: "Admin@123", perfil: "Administrador" },
    { id: 2, nome: "Bruno Lima", email: "bruno@empresa.com", senha: "Lider@123", perfil: "Líder de Projeto" },
    { id: 3, nome: "Carla Mendes", email: "carla@empresa.com", senha: "Membro@123", perfil: "Membro da Equipe" }
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
        idResponsavel: null,
        prazo: null,
        dataCriacao: "2026-10-08T16:00:00.000Z",
        dataAtualizacao: "2026-10-08T16:00:00.000Z"
    }
];
