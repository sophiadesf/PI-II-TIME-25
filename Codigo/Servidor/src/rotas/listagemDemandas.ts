/*
    Rotas de listagem de demandas

    Autor: João Felipe Bodo Pinheiro
*/

import express, { Request, Response } from "express";
import { demandas, projetos, usuarios } from "../dados/dados";

const router = express.Router();

// Ordem usada para ordenar por prioridade e por status
const ordemPrioridade = ["Crítica", "Alta", "Média", "Baixa"];
const ordemStatus = ["Aberta", "Em andamento", "Em revisão", "Concluída", "Cancelada"];
const ordenacoesValidas = ["prioridade", "dataCriacao", "prazo", "status"];

// GET /demandas - lista as demandas com filtros, busca e ordenação
// Filtros: status, prioridade, tipo, idResponsavel e idProjeto | Busca: busca | Ordenação: ordenar
// Exemplo: /demandas?status=Aberta&prioridade=Alta&busca=login&ordenar=prazo
router.get("/", (req: Request, res: Response) => {
    const { status, prioridade, tipo, idResponsavel, idProjeto, busca, ordenar } = req.query;

    //Validar ordenação
    if (ordenar && !ordenacoesValidas.includes(String(ordenar))) {
        return res.status(400).json({ erro: "Ordenação inválida. Use: prioridade, dataCriacao, prazo ou status." });
    }

    // Copia a lista para os filtros e a ordenação não alterarem os dados originais
    let resultado = demandas.slice();

    // Filtros (cada um só é aplicado se for informado na URL)
    if (status) {
        resultado = resultado.filter(demanda => demanda.status === status);
    }
    if (prioridade) {
        resultado = resultado.filter(demanda => demanda.prioridade === prioridade);
    }
    if (tipo) {
        resultado = resultado.filter(demanda => demanda.tipo === tipo);
    }
    if (idResponsavel) {
        resultado = resultado.filter(demanda => demanda.idResponsavel === Number(idResponsavel));
    }
    if (idProjeto) {
        resultado = resultado.filter(demanda => demanda.idProjeto === Number(idProjeto));
    }

    // Busca textual no título ou na descrição, sem diferenciar maiúsculas e minúsculas
    if (busca) {
        const pesquisa = String(busca).toLowerCase();
        resultado = resultado.filter(demanda =>
            demanda.titulo.toLowerCase().includes(pesquisa) ||
            demanda.descricao.toLowerCase().includes(pesquisa)
        );
    }

    // Ordenação
    if (ordenar === "prioridade") {
        resultado.sort((a, b) => ordemPrioridade.indexOf(a.prioridade) - ordemPrioridade.indexOf(b.prioridade));
    } else if (ordenar === "status") {
        resultado.sort((a, b) => ordemStatus.indexOf(a.status) - ordemStatus.indexOf(b.status));
    } else if (ordenar === "dataCriacao") {
        resultado.sort((a, b) => a.dataCriacao.localeCompare(b.dataCriacao));
    } else if (ordenar === "prazo") {
        // Demandas sem prazo vão para o final da lista
        resultado.sort((a, b) => (a.prazo || "9999-99-99").localeCompare(b.prazo || "9999-99-99"));
    }

    // Acrescenta o nome do projeto e do responsável em cada demanda
    const listaCompleta = resultado.map(demanda => {
        const projeto = projetos.find(item => item.id === demanda.idProjeto);
        const responsavel = usuarios.find(item => item.id === demanda.idResponsavel);

        return {
            ...demanda,
            nomeProjeto: projeto ? projeto.nome : null,
            nomeResponsavel: responsavel ? responsavel.nome : null
        };
    });

    return res.status(200).json(listaCompleta);
});

export default router;
