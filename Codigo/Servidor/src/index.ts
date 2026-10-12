/*
    Ponto de entrada do servidor (API do Sistema de Acompanhamento de Demandas)

    Autor: Pedro Tafner (migração para TypeScript)
*/

import express, { Request, Response } from "express";
import rotasProjetos from "./rotas/projetos";
import rotasDemandas from "./rotas/demandas";
import listaDemandas from "./rotas/listagemDemandas";

const app = express();
const PORTA = 3000;

// Permite que a API receba o corpo das requisições POST em formato JSON
app.use(express.json());

// Rota inicial para verificar se o servidor está respondendo
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "API do Sistema de Acompanhamento de Demandas ativa" });
});

// Rotas do sistema
app.use("/projetos", rotasProjetos);
app.use("/demandas", rotasDemandas);
app.use("/listagem", listaDemandas);

app.listen(PORTA, () => {
    console.log(`Servidor ativo na porta ${PORTA}`);
});
