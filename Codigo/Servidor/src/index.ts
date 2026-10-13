/*
    Ponto de entrada do servidor (API do Sistema de Acompanhamento de Demandas)

    Autor: Pedro Tafner
*/

import express, { Request, Response, NextFunction } from "express";
import rotasLogin from "./rotas/login";                       // Sophia de Souza Fabri
import rotasDashboard from "./rotas/dashboard";               // Sophia Dalla Bernardita Lopes
import rotasListagem from "./rotas/listagemDemandas";         // João Felipe Bodo Pinheiro
import rotasDemandas from "./rotas/demandas";                 // Pedro Tafner
import rotasProjetos from "./rotas/projetos";                 // Pedro Tafner
import rotasDetalhesDemanda from "./rotas/detalhesdemanda";   // Arthur Cavallaro Paioli

const app = express();
const PORTA = 3000;

// Permite que a API receba o corpo das requisições POST em formato JSON
app.use(express.json());

// Deixa o JSON das respostas formatado (com quebra de linha e recuo de 2 espaços)
app.set("json spaces", 2);

// Rota inicial para verificar se o servidor está respondendo
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "API do Sistema de Acompanhamento de Demandas ativa" });
});

// Rotas do sistema
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

app.listen(PORTA, () => {
    console.log(`Servidor ativo na porta ${PORTA}`);
});
