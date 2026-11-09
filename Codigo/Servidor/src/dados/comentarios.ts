/*
    Dados de teste dos comentários (tela Detalhes da Demanda)

    Autor: Arthur Cavallaro Paioli
*/

// Formato de um comentário
export interface Comentario {
    id: number;
    idDemanda: number;
    idUsuario: number;
    texto: string;
    dataHora: string;
}

export const comentarios: Comentario[] = [
    {
        id: 1,
        idDemanda: 1,
        idUsuario: 3,
        texto: "Identifiquei o problema e estou verificando o comportamento do login.",
        dataHora: "2026-10-02T14:30:00.000Z"
    },
    {
        id: 2,
        idDemanda: 1,
        idUsuario: 2,
        texto: "Por favor, confirme se o e-mail é tratado sem diferenciar maiúsculas e minúsculas.",
        dataHora: "2026-10-03T10:15:00.000Z"
    },
    {
        id: 3,
        idDemanda: 2,
        idUsuario: 2,
        texto: "A tela de relatórios está em desenvolvimento.",
        dataHora: "2026-10-06T09:20:00.000Z"
    }
];
