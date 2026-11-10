/*
    Ponto de entrada do servidor

    Autor: Pedro Tafner
*/

import cors from 'cors';
import express, { Request, Response, NextFunction } from "express";
import rotasLogin from "./rotas/login";                       // Sophia de Souza Fabri
import rotasDashboard from "./rotas/dashboard";               // Sophia Dalla Bernardina Lopes
import rotasListagem from "./rotas/listagemDemandas";         // João Felipe Bodo Pinheiro
import rotasDemandas from "./rotas/demandas";                 // Pedro Tafner
import rotasProjetos from "./rotas/projetos";                 // Pedro Tafner
import rotasDetalhesDemanda from "./rotas/detalhesdemanda";   // Arthur Cavallaro Paioli
import { initPool, getConn, closePool } from "./db";

const app = express();
const PORTA = 3000;

// Permite que a API receba o corpo das requisições POST em formato JSON e use o CORS
app.use(cors());
app.use(express.json());

// Deixa o JSON das respostas formatado (com quebra de linha e recuo de 2 espaços)
app.set("json spaces", 2);

// Rota inicial para verificar se o servidor está respondendo
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "API do Sistema de Acompanhamento de Demandas ativa" });
});

// GET /banco - testa a conexão com o Oracle pedindo a data e hora atual do banco
// (DUAL é uma tabela especial do Oracle que sempre existe, então funciona sem nenhuma tabela criada)
app.get("/banco", async (req: Request, res: Response) => {
    let conexao;

    try {
        // Pega uma conexão emprestada do pool
        conexao = await getConn();

        const resultado = await conexao.execute("SELECT SYSDATE AS DATA_HORA FROM DUAL");

        res.status(200).json({ mensagem: "Conexão com o banco funcionando", banco: resultado.rows });
    } catch (erro) {
        console.error("Erro ao acessar o banco:", erro);
        res.status(500).json({ erro: "Não foi possível acessar o banco de dados." });
    } finally {
        // Devolve a conexão para o pool (mesmo se der erro)
        if (conexao) {
            await conexao.close();
        }
    }
});

// Liga o servidor: primeiro conecta no banco, depois começa a receber requisições
async function iniciarServidor() {
    try {
        // Prepara o pool de conexões com o Oracle.
        await initPool();

        // Inicia o servidor HTTP.
        app.listen(PORTA, () => {
            console.log(`Servidor ativo na porta ${PORTA}`);
        });

        // Registra o encerramento ao pressionar Ctrl+C.
        process.on("SIGINT", encerrarServidor);

        // Registra o encerramento solicitado pelo ambiente.
        process.on("SIGTERM", encerrarServidor);
    } catch (erro) {
        console.error("Falha ao iniciar o servidor:", erro);
        process.exit(1);
    }
}

// Desliga o servidor com segurança, fechando as conexões com o banco
async function encerrarServidor() {
    try {
        await closePool();
        console.log("Pool de conexões encerrado.");
        process.exit(0);
    } catch (erro) {
        console.error("Falha ao encerrar o pool:", erro);
        process.exit(1);
    }
}

// Rotas do sistema (usa os dados fictícios)
app.use("/", rotasLogin);                       // POST /login e GET /usuarios
app.use("/dashboard", rotasDashboard);          // GET /dashboard
app.use("/demandas", rotasListagem);            // GET /demandas (filtros, busca e ordenação)
app.use("/demandas", rotasDemandas);            // POST /demandas
app.use("/projetos", rotasProjetos);            // GET /projetos
app.use("/demandas", rotasDetalhesDemanda);     // GET /demandas/:id e comentários

// Qualquer rota que não existir responde 404 em JSON
app.use((req: Request, res: Response) => {
    res.status(404).json({ erro: "Rota não encontrada." });
});

// Se o JSON enviado estiver mal escrito, responde 400 em JSON (em vez de uma página de erro)
// Obs: os 4 parâmetros são obrigatórios, é assim que o Express reconhece que essa função trata erros
app.use((erro: any, req: Request, res: Response, next: NextFunction) => {
    if (erro.type === "entity.parse.failed") {
        res.status(400).json({ erro: "O corpo da requisição não é um JSON válido." });
        return;
    }

    console.log(erro);
    res.status(500).json({ erro: "Erro interno no servidor." });
});

// Liga o servidor
iniciarServidor();
