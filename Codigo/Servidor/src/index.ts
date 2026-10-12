/*
    Ponto de entrada do servidor (API do Sistema de Acompanhamento de Demandas)

    Autor: Pedro Tafner (migração para TypeScript)
*/

import express, { Request, Response } from "express";

const app = express();
const PORTA = 3000;

// Permite que a API receba o corpo das requisições POST em formato JSON
app.use(express.json());

// Rota inicial para verificar se o servidor está respondendo
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ mensagem: "API do Sistema de Acompanhamento de Demandas ativa" });
});

app.listen(PORTA, () => {
    console.log(`Servidor ativo na porta ${PORTA}`);
});
