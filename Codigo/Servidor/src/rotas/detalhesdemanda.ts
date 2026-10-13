/*
 * Rotas da tela Detalhes da Demanda.
 * Autor responsável: Arthur Cavallaro Paioli
 * Reunião 4: consulta de demanda e consulta/cadastro de comentários.
 */

import { Router, Request, Response } from "express";
import { demandas, projetos, usuarios, comentarios, Comentario } from "../dados/dados";


const rotasDetalhesDemanda = Router();

// Converte o parâmetro da URL e procura a demanda. IDs inválidos não encontram registro.
function buscarDemanda(idRecebido: string) {
    const id = Number(idRecebido);

    if (!Number.isInteger(id) || id <= 0) {
        return undefined;
    }

    return demandas.find((demanda) => demanda.id === id);
}

// Acrescenta o nome do usuário a resposta sem expor a senha armazenada nos dados de teste.
function apresentarComentario(comentario: Comentario) {
    const usuario = usuarios.find((item) => item.id === comentario.idUsuario);

    return {
        ...comentario,
        nomeUsuario: usuario?.nome ?? "Usuário não encontrado"
    };
}

// GET /demandas/:id - retorna todos os campos da demanda e os nomes relacionados.
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

// GET /demandas/:id/comentarios - lista os comentários de uma demanda existente.
rotasDetalhesDemanda.get("/:id/comentarios", (req: Request<{ id: string }, {}, { idUsuario: number; texto: string }>, res: Response) => {
    const demanda = buscarDemanda(req.params.id);

    if (!demanda) {
        return res.status(404).json({ erro: "Demanda não encontrada." });
    }

    const comentariosDaDemanda = comentarios
        .filter((comentario) => comentario.idDemanda === demanda.id)
        .map(apresentarComentario);

    return res.status(200).json(comentariosDaDemanda);
});

// POST /demandas/:id/comentarios - valida e salva comentário vinculado à demanda e a um usuário.
rotasDetalhesDemanda.post("/:id/dados", (req: Request<{ id: string }, {}, { idUsuario: number; texto: string }>, res: Response) => {
    const demanda = buscarDemanda(req.params.id);

    // A especificação exige 404 quando a demanda não existe.
    if (!demanda) {
        return res.status(404).json({ erro: "Demanda não encontrada." });
    }

    const corpo = req.body;

    if (!corpo || typeof corpo !== "object" || Array.isArray(corpo)) {
        return res.status(400).json({ erro: "Envie um objeto JSON com idUsuario e texto." });
    }

    const textoRecebido = corpo.texto;

    if (typeof textoRecebido !== "string" || textoRecebido.trim() === "") {
        return res.status(400).json({ erro: "O texto do comentário é obrigatório e não pode ficar vazio." });
    }

    const idUsuario = Number(corpo.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({ erro: "Informe um idUsuario válido para o comentário." });
    }

    const usuario = usuarios.find((item) => item.id === idUsuario);

    if (!usuario) {
        return res.status(400).json({ erro: "O usuário informado não existe." });
    }

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
