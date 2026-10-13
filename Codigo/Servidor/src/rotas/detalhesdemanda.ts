/*
    Rotas de detalhes da demanda e comentários

    Autor: Arthur Cavallaro Paioli
*/

import { Router, Request, Response } from "express";
import { demandas, projetos, usuarios } from "../dados/dados";
import { comentarios, Comentario } from "../dados/comentarios";

const rotasDetalhesDemanda = Router();

// Converte o id da URL em número e procura a demanda (ids inválidos não encontram nada)
function buscarDemanda(idRecebido: string) {
    const id = Number(idRecebido);

    if (!Number.isInteger(id) || id <= 0) {
        return undefined;
    }

    return demandas.find((demanda) => demanda.id === id);
}

// Acrescenta o nome do usuário no comentário, sem expor a senha
function apresentarComentario(comentario: Comentario) {
    const usuario = usuarios.find((item) => item.id === comentario.idUsuario);

    return {
        ...comentario,
        nomeUsuario: usuario?.nome ?? "Usuário não encontrado"
    };
}

// GET /demandas/:id - retorna todos os campos da demanda, com o projeto e o responsável
rotasDetalhesDemanda.get("/:id", (req: Request<{ id: string }>, res: Response) => {
    const demanda = buscarDemanda(req.params.id);

    if (!demanda) {
        return res.status(404).json({ erro: "Demanda não encontrada." });
    }

    const projeto = projetos.find((item) => item.id === demanda.idProjeto) ?? null;
    const responsavelEncontrado = usuarios.find((item) => item.id === demanda.idResponsavel);
    const responsavel = responsavelEncontrado
        ? {
            id: responsavelEncontrado.id,
            nome: responsavelEncontrado.nome,
            email: responsavelEncontrado.email,
            perfil: responsavelEncontrado.perfil
        }
        : null;

    return res.status(200).json({
        ...demanda,
        projeto,
        responsavel
    });
});

// GET /demandas/:id/comentarios - lista os comentários de uma demanda
rotasDetalhesDemanda.get("/:id/comentarios", (req: Request<{ id: string }>, res: Response) => {
    const demanda = buscarDemanda(req.params.id);

    if (!demanda) {
        return res.status(404).json({ erro: "Demanda não encontrada." });
    }

    const comentariosDaDemanda = comentarios
        .filter((comentario) => comentario.idDemanda === demanda.id)
        .map(apresentarComentario);

    return res.status(200).json(comentariosDaDemanda);
});

// POST /demandas/:id/comentarios - cadastra um comentário vinculado à demanda e a um usuário
rotasDetalhesDemanda.post("/:id/comentarios", (req: Request<{ id: string }, {}, { idUsuario: number; texto: string }>, res: Response) => {
    const demanda = buscarDemanda(req.params.id);

    //Validar Demanda (404 quando ela não existe)
    if (!demanda) {
        return res.status(404).json({ erro: "Demanda não encontrada." });
    }

    const corpo = req.body;

    //Validar Corpo da requisição
    if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
        return res.status(400).json({ erro: "Envie um objeto JSON com idUsuario e texto." });
    }

    const textoRecebido = corpo.texto;

    //Validar Texto (não pode ficar vazio)
    if (typeof textoRecebido !== "string" || textoRecebido.trim() === "") {
        return res.status(400).json({ erro: "O texto do comentário é obrigatório e não pode ficar vazio." });
    }

    const idUsuario = Number(corpo.idUsuario);

    //Validar Usuário (precisa ser um número inteiro positivo)
    if ((typeof corpo.idUsuario !== "number" && typeof corpo.idUsuario !== "string") || !Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({ erro: "Informe um idUsuario válido para o comentário." });
    }

    const usuario = usuarios.find((item) => item.id === idUsuario);

    if (!usuario) {
        return res.status(400).json({ erro: "O usuário informado não existe." });
    }

    // Data e horário são registrados pelo servidor
    // O novo id é o maior id existente + 1
    const proximoId = comentarios.reduce(
        (maiorId, comentario) => Math.max(maiorId, comentario.id),
        0
    ) + 1;

    const novoComentario: Comentario = {
        id: proximoId,
        idDemanda: demanda.id,
        idUsuario: usuario.id,
        texto: textoRecebido.trim(),
        dataHora: new Date().toISOString()
    };

    comentarios.push(novoComentario);

    return res.status(201).json(apresentarComentario(novoComentario));
});

export default rotasDetalhesDemanda;
