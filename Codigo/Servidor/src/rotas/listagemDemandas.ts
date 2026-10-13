// Autoria: João Felipe

import express, { Request, Response } from "express";
import { demandas } from "../dados/dados"; 

const router = express.Router();

// Função auxiliar para garantir que o query param seja sempre um array de strings
const normalizarArray = (param: any): string[] => {
    if (!param) return [];
    if (Array.isArray(param)) return param.map(String);
    return [String(param)];
};

// GET /demandas 
router.get("/", (req: Request, res: Response) => {
    let resultado = [...demandas]; 

    const statusArray = normalizarArray(req.query.status);
    const prioridadeArray = normalizarArray(req.query.prioridade);
    const tipoArray = normalizarArray(req.query.tipo);
    const busca = req.query.busca ? String(req.query.busca).toLowerCase() : "";

    // Conta exatamente a quantidade de opções (checkboxes) marcadas, ignorando a busca textual
    const totalFiltros = statusArray.length + prioridadeArray.length + tipoArray.length;
    
    // Regra 1: Se enviou exatamente 1 filtro, bloqueia
    if (totalFiltros === 1) {
        return res.status(400).json({ error: "É necessário informar pelo menos dois critérios de busca" });
    }

    // Regra 2: A filtragem só ocorre se tiver 2 ou mais filtros selecionados
    if (totalFiltros >= 2) {
        if (statusArray.length > 0) {
            const statusLowerCase = statusArray.map(status => status.toLowerCase());
            resultado = resultado.filter(demanda => statusLowerCase.includes(demanda.status.toLowerCase()));
        }

        if (prioridadeArray.length > 0) {
            const prioridadeLowerCase = prioridadeArray.map(prioridade => prioridade.toLowerCase());
            resultado = resultado.filter(demanda => prioridadeLowerCase.includes(demanda.prioridade.toLowerCase()));
        }

        if (tipoArray.length > 0) {
            const tipoLowerCase = tipoArray.map(tipo => tipo.toLowerCase());
            resultado = resultado.filter(demanda => tipoLowerCase.includes(demanda.tipo.toLowerCase()));
        }
    }

    // Regra 3: A busca textual ocorre de forma independente dos checkboxes
    if (busca) {
        if (busca.length < 3) {
            return res.status(400).json({ error: "A busca deve ter no mínimo 3 caracteres" });
        }
        
        resultado = resultado.filter(demanda => 
            demanda.titulo.toLowerCase().includes(busca) || 
            demanda.descricao.toLowerCase().includes(busca)
        ); 
    }
    
    return res.status(200).json(resultado);
});

// GET /demandas/:id
router.get("/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido. O ID deve ser um número." });
    }

    const demanda = demandas.find(demanda => demanda.id === id);
    
    if (!demanda) {
        return res.status(404).json({ error: "Demanda não encontrada" });
    }

    return res.status(200).json(demanda);
});

export default router;