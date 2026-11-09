/*
    Rotas de cadastro de demandas

    Autor: Pedro Tafner
*/

import { Router, Request, Response } from "express";
import { demandas, projetos, usuarios, Demanda } from "../dados/dados";

const rotasDemandas = Router();

const tiposValidos = ["Tarefa", "Defeito", "Melhoria", "Documentação"];
const prioridadesValidas = ["Crítica", "Alta", "Média", "Baixa"];

// Verifica se o texto foi enviado e não está vazio
function textoPreenchido(texto: any): boolean {
    return typeof texto === "string" && texto.trim() !== "";
}

// Verifica se o prazo está no formato AAAA-MM-DD e se é uma data que existe
function prazoValido(prazo: any): boolean {
    if (typeof prazo !== "string") {
        return false;
    }

    const partes = prazo.split("-");

    if (partes.length !== 3 || partes[0].length !== 4 || partes[1].length !== 2 || partes[2].length !== 2) {
        return false;
    }

    const ano = Number(partes[0]);
    const mes = Number(partes[1]);
    const dia = Number(partes[2]);

    // Se a data não existir, o JavaScript passa para o mês seguinte
    const data = new Date(ano, mes - 1, dia);

    return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

// POST /demandas - cadastra uma nova demanda
rotasDemandas.post("/", (req: Request, res: Response) => {
    // Se a requisição vier sem corpo, usa um objeto vazio para não dar erro
    const corpo = req.body || {};

    const titulo = corpo.titulo;
    const descricao = corpo.descricao;
    const tipo = corpo.tipo;
    const prioridade = corpo.prioridade;
    const idProjeto = corpo.idProjeto;
    const idResponsavel = corpo.idResponsavel;
    const prazo = corpo.prazo;

    const erros: string[] = [];

    //Validar Título
    if (!textoPreenchido(titulo)) {
        erros.push("Escreva o título da demanda.");
    }

    //Validar Descrição
    if (!textoPreenchido(descricao)) {
        erros.push("Escreva a descrição da demanda.");
    }

    //Validar Tipo
    if (!textoPreenchido(tipo)) {
        erros.push("Escolha o tipo da demanda.");
    } else if (!tiposValidos.includes(tipo)) {
        erros.push("Tipo inválido. Use: Tarefa, Defeito, Melhoria ou Documentação.");
    }

    //Validar Prioridade
    if (!textoPreenchido(prioridade)) {
        erros.push("Escolha a prioridade da demanda.");
    } else if (!prioridadesValidas.includes(prioridade)) {
        erros.push("Prioridade inválida. Use: Crítica, Alta, Média ou Baixa.");
    }

    //Validar Projeto
    if (idProjeto === undefined || idProjeto === null || idProjeto === "") {
        erros.push("Escolha o projeto ao qual se refere essa demanda.");
    } else if (typeof idProjeto !== "number" && typeof idProjeto !== "string") {
        erros.push("O projeto deve ser informado pelo seu número (id).");
    } else {
        const projetoEncontrado = projetos.find(function (projeto) {
            return projeto.id === Number(idProjeto);
        });

        if (projetoEncontrado === undefined) {
            erros.push("O projeto informado não existe.");
        }
    }

    //Validar Responsável (pode ficar em branco)
    let responsavelFinal: number | null = null;

    if (idResponsavel !== undefined && idResponsavel !== null && idResponsavel !== "") {
        if (typeof idResponsavel !== "number" && typeof idResponsavel !== "string") {
            erros.push("O responsável deve ser informado pelo seu número (id).");
        } else {
            const usuarioEncontrado = usuarios.find(function (usuario) {
                return usuario.id === Number(idResponsavel);
            });

            if (usuarioEncontrado === undefined) {
                erros.push("O responsável informado não existe.");
            } else {
                responsavelFinal = usuarioEncontrado.id;
            }
        }
    }

    //Validar Prazo de Finalização (pode ficar em branco)
    let prazoFinal: string | null = null;

    if (prazo !== undefined && prazo !== null && prazo !== "") {
        if (!prazoValido(prazo)) {
            erros.push("Prazo inválido. Use o formato AAAA-MM-DD com uma data que exista.");
        } else {
            prazoFinal = prazo;
        }
    }

    // Se tiver algum erro, devolve todos de uma vez com status 400
    if (erros.length > 0) {
        res.status(400).json({ erros: erros });
        return;
    }

    // Status e datas são sempre definidos pelo servidor,
    // mesmo que a requisição envie outros valores
    const agora = new Date().toISOString();

    // Procura o maior id que já existe para o novo não se repetir
    let maiorId = 0;
    demandas.forEach(function (demanda) {
        if (demanda.id > maiorId) {
            maiorId = demanda.id;
        }
    });

    const novaDemanda: Demanda = {
        id: maiorId + 1,
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipo: tipo,
        prioridade: prioridade,
        status: "Aberta",
        idProjeto: Number(idProjeto),
        idResponsavel: responsavelFinal,
        prazo: prazoFinal,
        dataCriacao: agora,
        dataAtualizacao: agora
    };

    demandas.push(novaDemanda);

    res.status(201).json(novaDemanda);
});

export default rotasDemandas;
