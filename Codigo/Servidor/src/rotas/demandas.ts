/*
    Rotas de cadastro de demandas

    Autor: Pedro Tafner
*/

import { Router, Request, Response } from "express";
import oracledb from "oracledb";
import { getConn } from "../db";

const rotasDemandas = Router();

// Valores aceitos pelo banco (SEM acento, por causa das regras CHECK da tabela DEMANDAS)
const tiposValidos = ["Tarefa", "Defeito", "Melhoria", "Documentacao"];
const prioridadesValidas = ["Critica", "Alta", "Media", "Baixa"];

// Tira os acentos de um texto ("Crítica" vira "Critica")
// Assim a API aceita o valor com ou sem acento, mas grava sempre do jeito que o banco aceita
function tirarAcentos(texto: string): string {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Verifica se o texto foi enviado e não está vazio
function textoPreenchido(texto: any): boolean {
    return typeof texto === "string" && texto.trim() !== "";
}

// Verifica se o valor foi enviado (não é undefined, null nem texto vazio)
function foiInformado(valor: any): boolean {
    return valor !== undefined && valor !== null && valor !== "";
}

// Converte um id recebido (número ou texto com número) para número inteiro
// Devolve null se não for um id válido (ex: "abc", true, 1.5, -2)
function converterId(valor: any): number | null {
    if (typeof valor !== "number" && typeof valor !== "string") {
        return null;
    }

    const numero = Number(valor);

    if (!Number.isInteger(numero) || numero <= 0) {
        return null;
    }

    return numero;
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

// POST /demandas - cadastra uma nova demanda no banco de dados
rotasDemandas.post("/", async (req: Request, res: Response) => {
    // Se a requisição vier sem corpo, usa um objeto vazio para não dar erro
    const corpo = req.body || {};

    const titulo = corpo.titulo;
    const descricao = corpo.descricao;
    const tipo = corpo.tipo;
    const prioridade = corpo.prioridade;
    const prazo = corpo.prazo;

    const idProjeto = converterId(corpo.idProjeto);
    const idResponsavel = converterId(corpo.idResponsavel);
    const idSolicitante = converterId(corpo.idSolicitante);

    const erros: string[] = [];

    // ---------- 1ª parte: validações que não precisam do banco ----------

    //Validar Título
    if (!textoPreenchido(titulo)) {
        erros.push("Escreva o título da demanda.");
    } else if (titulo.trim().length > 150) {
        erros.push("O título pode ter no máximo 150 caracteres.");
    }

    //Validar Descrição
    if (!textoPreenchido(descricao)) {
        erros.push("Escreva a descrição da demanda.");
    } else if (descricao.trim().length > 2000) {
        erros.push("A descrição pode ter no máximo 2000 caracteres.");
    }

    //Validar Tipo
    let tipoFinal = "";

    if (!textoPreenchido(tipo)) {
        erros.push("Escolha o tipo da demanda.");
    } else if (!tiposValidos.includes(tirarAcentos(tipo))) {
        erros.push("Tipo inválido. Use: Tarefa, Defeito, Melhoria ou Documentação.");
    } else {
        tipoFinal = tirarAcentos(tipo);
    }

    //Validar Prioridade
    let prioridadeFinal = "";

    if (!textoPreenchido(prioridade)) {
        erros.push("Escolha a prioridade da demanda.");
    } else if (!prioridadesValidas.includes(tirarAcentos(prioridade))) {
        erros.push("Prioridade inválida. Use: Crítica, Alta, Média ou Baixa.");
    } else {
        prioridadeFinal = tirarAcentos(prioridade);
    }

    //Validar Projeto (obrigatório)
    if (!foiInformado(corpo.idProjeto)) {
        erros.push("Escolha o projeto ao qual se refere essa demanda.");
    } else if (idProjeto === null) {
        erros.push("O projeto deve ser informado pelo seu número (id).");
    }

    //Validar Responsável (pode ficar em branco)
    if (foiInformado(corpo.idResponsavel) && idResponsavel === null) {
        erros.push("O responsável deve ser informado pelo seu número (id).");
    }

    //Validar Solicitante (quem está cadastrando a demanda, vem do usuário logado)
    if (!foiInformado(corpo.idSolicitante)) {
        erros.push("Informe o solicitante da demanda (faça login para cadastrar).");
    } else if (idSolicitante === null) {
        erros.push("O solicitante deve ser informado pelo seu número (id).");
    }

    //Validar Prazo de Finalização (pode ficar em branco)
    let prazoFinal: string | null = null;

    if (foiInformado(prazo)) {
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

    // ---------- 2ª parte: validações e cadastro no banco ----------
    let conexao;

    try {
        // Pega uma conexão emprestada do pool
        conexao = await getConn();

        //Validar se o projeto existe e está ativo
        const projeto = await conexao.execute(
            `SELECT ID_PROJETO FROM PROJETOS WHERE ID_PROJETO = :id AND ATIVO = 'S'`,
            { id: idProjeto }
        );

        if (!projeto.rows || projeto.rows.length === 0) {
            erros.push("O projeto informado não existe.");
        }

        //Validar se o solicitante existe e está ativo
        const solicitante = await conexao.execute(
            `SELECT ID_USUARIO FROM USUARIOS WHERE ID_USUARIO = :id AND ATIVO = 'S'`,
            { id: idSolicitante }
        );

        if (!solicitante.rows || solicitante.rows.length === 0) {
            erros.push("O solicitante informado não existe.");
        }

        //Validar se o responsável existe e participa do projeto
        if (idResponsavel !== null) {
            const responsavel = await conexao.execute(
                `SELECT ID_USUARIO FROM USUARIOS WHERE ID_USUARIO = :id AND ATIVO = 'S'`,
                { id: idResponsavel }
            );

            if (!responsavel.rows || responsavel.rows.length === 0) {
                erros.push("O responsável informado não existe.");
            } else {
                const participa = await conexao.execute(
                    `SELECT ID_USUARIO FROM PROJETO_USUARIO WHERE ID_PROJETO = :idProjeto AND ID_USUARIO = :idUsuario`,
                    { idProjeto: idProjeto, idUsuario: idResponsavel }
                );

                if (!participa.rows || participa.rows.length === 0) {
                    erros.push("O responsável informado não participa desse projeto.");
                }
            }
        }

        if (erros.length > 0) {
            res.status(400).json({ erros: erros });
            return;
        }

        // Status e datas são sempre definidos pelo servidor,
        // mesmo que a requisição envie outros valores
        const agora = new Date();

        // Cadastra a demanda. O ID não é informado: o banco gera sozinho e
        // devolve o número gerado no "RETURNING ... INTO :idNovo"
        const cadastro = await conexao.execute(
            `INSERT INTO DEMANDAS (TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE,
                                   ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
             VALUES (:titulo, :descricao, :tipo, :prioridade, 'Aberta', :idProjeto, :idSolicitante,
                     :idResponsavel, TO_DATE(:prazo, 'YYYY-MM-DD'), :dataCriacao, :dataAtualizacao)
             RETURNING ID_DEMANDA INTO :idNovo`,
            {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                tipo: tipoFinal,
                prioridade: prioridadeFinal,
                idProjeto: idProjeto,
                idSolicitante: idSolicitante,
                idResponsavel: idResponsavel,
                prazo: prazoFinal,
                dataCriacao: agora,
                dataAtualizacao: agora,
                idNovo: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            },
            { autoCommit: true } // Salva de vez no banco (COMMIT)
        );

        const saida = cadastro.outBinds as { idNovo: number[] };
        const idNovaDemanda = saida.idNovo[0];

        // Busca a demanda que acabou de ser criada, já com os nomes do projeto e dos usuários
        const novaDemanda = await conexao.execute(
            `SELECT D.ID_DEMANDA AS "id", D.TITULO AS "titulo", D.DESCRICAO AS "descricao",
                    D.TIPO AS "tipo", D.PRIORIDADE AS "prioridade", D.STATUS AS "status",
                    D.ID_PROJETO AS "idProjeto", P.NOME AS "nomeProjeto",
                    D.ID_SOLICITANTE AS "idSolicitante", S.NOME AS "nomeSolicitante",
                    D.ID_RESPONSAVEL AS "idResponsavel", R.NOME AS "nomeResponsavel",
                    TO_CHAR(D.PRAZO_FINALIZACAO, 'YYYY-MM-DD') AS "prazo",
                    D.DATA_CRIACAO AS "dataCriacao", D.DATA_ATUALIZACAO AS "dataAtualizacao"
               FROM DEMANDAS D
               JOIN PROJETOS P ON P.ID_PROJETO = D.ID_PROJETO
               JOIN USUARIOS S ON S.ID_USUARIO = D.ID_SOLICITANTE
               LEFT JOIN USUARIOS R ON R.ID_USUARIO = D.ID_RESPONSAVEL
              WHERE D.ID_DEMANDA = :id`,
            { id: idNovaDemanda }
        );

        res.status(201).json(novaDemanda.rows ? novaDemanda.rows[0] : { id: idNovaDemanda });
    } catch (erro) {
        console.error("Erro ao cadastrar demanda:", erro);
        res.status(500).json({ erro: "Erro ao cadastrar a demanda no banco de dados." });
    } finally {
        // Devolve a conexão para o pool (mesmo se der erro)
        if (conexao) {
            await conexao.close();
        }
    }
});

export default rotasDemandas;
