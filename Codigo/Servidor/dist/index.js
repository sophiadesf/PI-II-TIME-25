"use strict";
/*
    Ponto de entrada do servidor (API do Sistema de Acompanhamento de Demandas)

    Autor: Pedro Tafner (migração para TypeScript)
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORTA = 3000;
// Permite que a API receba o corpo das requisições POST em formato JSON
app.use(express_1.default.json());
// Rota inicial para verificar se o servidor está respondendo
app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API do Sistema de Acompanhamento de Demandas ativa" });
});
app.listen(PORTA, () => {
    console.log(`Servidor ativo na porta ${PORTA}`);
});
