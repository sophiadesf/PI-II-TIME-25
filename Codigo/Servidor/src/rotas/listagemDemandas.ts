// Autoria: Joao Felipe

import express, { Request, Response } from "express";
import { demandas } from "../dados/dados"; 

const router = express.Router();

// Rota principal - GET /listagem
router.get("/", (req: Request, res: Response) => {
    let resultado = demandas;
    let cont = 0;

    const { status, prioridade, tipo, busca } = req.query;

    if (status) cont++;
    if (prioridade) cont++;
    if (tipo) cont++;
    if (busca) cont++;

    if (cont === 1) {
        return res.status(400).json({ error: "É necessário informar pelo menos dois critérios de busca" });
    }

    if (status) {
        resultado = resultado.filter(demanda => demanda.status === status);
    }
    if (prioridade) {
        resultado = resultado.filter(demanda => demanda.prioridade === prioridade);
    }
    if (tipo) {
        resultado = resultado.filter(demanda => demanda.tipo === tipo);
    }
    if (busca) {
        const pesquisa = String(busca).toLowerCase();
        resultado = resultado.filter(demanda => 
            demanda.titulo.toLowerCase().includes(pesquisa) || 
            demanda.descricao.toLowerCase().includes(pesquisa)
        );
    }
    
    return res.status(200).json(resultado);
});

// Rota por ID - GET /listagem/id
router.get("/:id", (req: Request, res: Response) => {
    const idConvertido = Number(req.params.id);
    const demanda = demandas.find(demanda => demanda.id === idConvertido);
    
    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }
    return res.status(200).json(demanda);
});

export default router;