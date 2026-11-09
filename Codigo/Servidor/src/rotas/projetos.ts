/*
    Rotas de projetos

    Autor: Pedro Tafner
*/

import { Router, Request, Response } from "express";
import { projetos } from "../dados/dados";

const rotasProjetos = Router();

// GET /projetos - lista os projetos pré-cadastrados
rotasProjetos.get("/", (req: Request, res: Response) => {
    res.status(200).json(projetos);
});

export default rotasProjetos;
