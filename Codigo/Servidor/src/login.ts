/**
 * Autora: Sophia Fabri
 * Descrição: Rota POST /login integrada ao banco Oracle
*/

import { Router, Request, Response } from 'express';
import { getConn } from './db'; // Importa a conexão com o Oracle configurada no projeto

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, senha } = req.body;

    // 1. Validação básica se os campos vieram preenchidos
    if (!email || !senha) {
        res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios.' });
        return;
    }

    let conexao;
    try {
        // Pega a conexão do pool do Oracle
        conexao = await getConn();

        // 2. Consulta real no banco de dados Oracle pelo e-mail
        const resultado = await conexao.execute(
            `SELECT id, nome, email, senha, perfil FROM usuarios WHERE email = :email`,
            [email]
        );

        const usuario = resultado.rows?.[0] as {
            ID: number;
            NOME: string;
            EMAIL: string;
            SENHA: string;
            PERFIL: string;
        } | undefined;

        // 3. Se o usuário não existir no banco
        if (!usuario) {
            res.status(404).json({ mensagem: 'Usuário não encontrado com este e-mail.' });
            return;
        }

        // Como o Oracle pode retornar as chaves em maiúsculas (dependendo de como foi criado), 
        // mapeamos as propriedades de forma segura:
        const senhaBanco = usuario.SENHA || usuario.SENHA;
        const idUsuario = usuario.ID || usuario.ID;
        const nomeUsuario = usuario.NOME || usuario.NOME;
        const emailUsuario = usuario.EMAIL || usuario.EMAIL;
        const perfilUsuario = usuario.PERFIL || usuario.PERFIL;

        // 4. Validação da senha
        if (senha !== senhaBanco) {
            res.status(401).json({ mensagem: 'Senha incorreta. Tente novamente.' });
            return;
        }

        // 5. Sucesso: Retorna os dados do usuário (exceto a senha)
        res.status(200).json({
            mensagem: 'Login realizado com sucesso!',
            usuario: {
                id: idUsuario,
                nome: nomeUsuario,
                email: emailUsuario,
                perfil: perfilUsuario
            },
            token: 'token-exemplo-jwt-ou-sessao'
        });

    } catch (erro) {
        console.error('Erro ao processar login no servidor:', erro);
        res.status(500).json({ mensagem: 'Erro interno no servidor ao tentar realizar o login.' });
    } finally {
        // Garante que a conexão será devolvida para o pool do Oracle
        if (conexao) {
            try {
                await conexao.close();
            } catch (err) {
                console.error('Erro ao fechar conexão:', err);
            }
        }
    }
});

export default router;