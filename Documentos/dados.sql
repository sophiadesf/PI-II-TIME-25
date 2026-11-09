-- Autoria: João Felipe

-- ==========================================================
-- 1. INSERINDO USUÁRIOS (dados.ts e dadosListagem.ts)
-- ==========================================================
INSERT INTO USUARIOS (ID_USUARIO, NOME, EMAIL, SENHA, PERFIL) 
VALUES (1, 'Ana Souza', 'ana@empresa.com', 'Admin@123', 'Administrador');

-- Ajustado de "Líder de Projeto" para "Lider de Projeto" devido à Check Constraint
INSERT INTO USUARIOS (ID_USUARIO, NOME, EMAIL, SENHA, PERFIL) 
VALUES (2, 'Bruno Lima', 'bruno@empresa.com', 'Lider@123', 'Lider de Projeto');

INSERT INTO USUARIOS (ID_USUARIO, NOME, EMAIL, SENHA, PERFIL) 
VALUES (3, 'Carla Mendes', 'carla@empresa.com', 'Membro@123', 'Membro da Equipe');

INSERT INTO USUARIOS (ID_USUARIO, NOME, EMAIL, SENHA, PERFIL) 
VALUES (4, 'Carlos Pinheiro', 'carlos@empresa.com', 'Membro@123', 'Membro da Equipe');

-- ==========================================================
-- 2. INSERINDO PROJETOS (dados.ts e dadosListagem.ts)
-- ==========================================================
INSERT INTO PROJETOS (ID_PROJETO, NOME) VALUES (1, 'Portal do Cliente');
INSERT INTO PROJETOS (ID_PROJETO, NOME) VALUES (2, 'Aplicativo Mobile');
INSERT INTO PROJETOS (ID_PROJETO, NOME) VALUES (3, 'Sistema Financeiro');
INSERT INTO PROJETOS (ID_PROJETO, NOME) VALUES (4, 'Sistema Web');

-- ==========================================================
-- 3. INSERINDO PROJETO_USUARIO (Faltou no TS - Dados Mockados)
-- ==========================================================
-- Ana Souza (Admin) em todos os projetos
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (1, 1);
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (2, 1);
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (3, 1);
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (4, 1);
-- Bruno, Carla e Carlos nos projetos onde possuem demandas alocadas
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (3, 2);
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (1, 2);
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (1, 3);
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (2, 3);
INSERT INTO PROJETO_USUARIO (ID_PROJETO, ID_USUARIO) VALUES (4, 4);

-- ==========================================================
-- 4. INSERINDO DEMANDAS (dados.ts, dadosListagem.ts e dadosDashboard.ts)
-- ==========================================================
-- OBS: ID_SOLICITANTE fixado como 1 (Ana). Acentos removidos para respeitar o CHECK.
INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (1, 'Corrigir erro no login', 'Usuários não conseguem entrar quando o e-mail tem letras maiúsculas.', 'Defeito', 'Critica', 'Aberta', 1, 1, 3, TO_DATE('2026-10-20', 'YYYY-MM-DD'), TO_DATE('2026-10-01 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-01 09:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (2, 'Criar tela de relatórios', 'Tela para exibir os relatórios mensais de vendas.', 'Tarefa', 'Media', 'Em andamento', 3, 1, 2, TO_DATE('2026-11-15', 'YYYY-MM-DD'), TO_DATE('2026-09-20 14:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-05 10:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (3, 'Documentar API de pagamentos', 'Escrever a documentação das rotas de pagamento.', 'Documentacao', 'Baixa', 'Aberta', 2, 1, 1, NULL, TO_DATE('2026-10-08 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-08 16:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (4, 'Corrigir login com caracteres especiais', 'Usuário não consegue logar quando a senha tem caracteres especiais.', 'Defeito', 'Alta', 'Aberta', 4, 1, 4, TO_DATE('2026-10-15', 'YYYY-MM-DD'), TO_DATE('2026-10-10 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-12 15:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (5, 'Criar tela de dashboard', 'Desenvolver a interface gráfica inicial do painel de indicadores.', 'Tarefa', 'Media', 'Em andamento', 2, 1, 1, NULL, TO_DATE('2026-10-11 08:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-12 17:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (6, 'Atualizar documentação da API', 'Adicionar os endpoints de GET e POST no README.', 'Documentacao', 'Baixa', 'Concluida', 4, 1, 4, NULL, TO_DATE('2026-10-01 13:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-05 16:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (7, 'Revisar melhorias do portal', 'Revisar as alterações da interface antes da entrega.', 'Melhoria', 'Alta', 'Em revisao', 1, 1, 2, TO_DATE('2026-10-16', 'YYYY-MM-DD'), TO_DATE('2026-10-09 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-11 14:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- Responsável NULL aceito na modelagem
INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (8, 'Corrigir erro já descartado', 'Demanda cancelada, mantida no histórico para consulta.', 'Defeito', 'Baixa', 'Cancelada', 3, 1, NULL, TO_DATE('2026-10-14', 'YYYY-MM-DD'), TO_DATE('2026-10-08 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-10 09:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO DEMANDAS (ID_DEMANDA, TITULO, DESCRICAO, TIPO, PRIORIDADE, STATUS, ID_PROJETO, ID_SOLICITANTE, ID_RESPONSAVEL, PRAZO_FINALIZACAO, DATA_CRIACAO, DATA_ATUALIZACAO)
VALUES (9, 'Corrigir falha no envio de pedidos', 'Falha crítica identificada na transmissão de pedidos.', 'Tarefa', 'Critica', 'Em andamento', 2, 1, 3, TO_DATE('2026-10-17', 'YYYY-MM-DD'), TO_DATE('2026-10-10 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2026-10-11 09:00:00', 'YYYY-MM-DD HH24:MI:SS'));

-- ==========================================================
-- 5. INSERINDO COMENTÁRIOS (comentarios.ts)
-- ==========================================================
INSERT INTO COMENTARIOS (ID_COMENTARIO, ID_DEMANDA, ID_USUARIO, TEXTO, DATA_HORA)
VALUES (1, 1, 3, 'Identifiquei o problema e estou verificando o comportamento do login.', TO_DATE('2026-10-02 14:30:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO COMENTARIOS (ID_COMENTARIO, ID_DEMANDA, ID_USUARIO, TEXTO, DATA_HORA)
VALUES (2, 1, 2, 'Por favor, confirme se o e-mail é tratado sem diferenciar maiúsculas e minúsculas.', TO_DATE('2026-10-03 10:15:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO COMENTARIOS (ID_COMENTARIO, ID_DEMANDA, ID_USUARIO, TEXTO, DATA_HORA)
VALUES (3, 2, 2, 'A tela de relatórios está em desenvolvimento.', TO_DATE('2026-10-06 09:20:00', 'YYYY-MM-DD HH24:MI:SS'));

COMMIT;