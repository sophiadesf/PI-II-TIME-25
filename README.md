# Grupo-25

--------------------------------------------

# Integrantes:

- Arthur Cavallaro Paioli  
- João Felipe Bodo Pinheiro 
- Pedro Henrique Tafner Reck 
- Sophia Dalla Bernardita Lopes
- Sophia de Souza Fabri

--------------------------------------------

# Curso:
- Engenharia de Software
  
--------------------------------------------

# Projeto-Integrador:
- II
  
--------------------------------------------

# Semestre e ano:
- II        2026
--------------------------------------------
# Professora Orientadora:
- Renata Arantes

--------------------------------------------

# Sistema de Acompanhamento de Demandas de Desenvolvimento

Sistema para registrar e acompanhar demandas (tarefas, defeitos, melhorias e documentação) dos projetos de desenvolvimento de uma equipe.

- **Frontend** (`Codigo/`): telas em HTML, CSS e JavaScript (Reuniões 2 e 3).
- **Backend** (`Codigo/Servidor/`): API em **Node.js + Express + TypeScript** (Reunião 4).

Nesta etapa, os dados ficam **em memória** (arquivo `dados.ts`). Ao reiniciar o servidor, tudo o que foi cadastrado é perdido e os dados voltam ao estado inicial. A integração com o banco de dados e com as telas será feita nas próximas etapas.

--------------------------------------------

# Como executar o servidor

**Pré-requisito:** [Node.js](https://nodejs.org/) na versão LTS (testado com a v24).

```bash
# 1. Entrar na pasta do servidor
cd Codigo/Servidor

# 2. Instalar as dependências (só na primeira vez ou depois de um git pull)
npm install

# 3. Iniciar o servidor
npm start
```

Quando aparecer `Servidor ativo na porta 3000`, a API está disponível em **http://localhost:3000**.

O `npm start` compila o TypeScript (`src/`) para JavaScript (`lib/`) e reinicia o servidor sozinho sempre que um arquivo é salvo. Para desligar, aperte `Ctrl + C` no terminal.

--------------------------------------------

# Estrutura do backend

```
Codigo/Servidor/
├── package.json             ← dependências e o comando npm start
├── tsconfig.json            ← configuração do TypeScript
├── testes/                  ← corpos JSON prontos para testar as rotas POST pelo cmd
└── src/
    ├── index.ts             ← ponto de entrada: cria o servidor e registra as rotas
    ├── dados/                ← dados de teste em memória (um arquivo por autor)
    │   ├── dados.ts             ← formatos (interfaces) e listas de projetos, usuários e demandas
    │   ├── dadosListagem.ts     ← projeto, usuário e demandas extras para a listagem
    │   ├── dadosDashboard.ts    ← demandas extras para o dashboard
    │   └── comentarios.ts       ← comentários das demandas
    └── rotas/
        ├── login.ts             ← POST /login e GET /usuarios
        ├── dashboard.ts         ← GET /dashboard
        ├── listagemDemandas.ts  ← GET /demandas
        ├── demandas.ts          ← POST /demandas
        ├── projetos.ts          ← GET /projetos
        └── detalhesdemanda.ts   ← GET /demandas/:id e comentários
```

--------------------------------------------

# Rotas da API

Todas as respostas são em **JSON**. Os erros seguem o formato `{ "erro": "mensagem" }`, com exceção do cadastro de demanda, que devolve todos os erros de uma vez em `{ "erros": [ ... ] }`.

| Responsável | Método | Rota | Descrição |
|---|---|---|---|
| Sophia de Souza Fabri | POST | `/login` | Confere e-mail e senha e devolve o usuário com o perfil (sem a senha) |
| Sophia de Souza Fabri | GET | `/usuarios` | Lista os usuários (sem as senhas) |
| Sophia Dalla Bernardita Lopes | GET | `/dashboard` | Totais por status, prioridade e tipo, críticas em aberto e próximas do prazo |
| João Felipe Bodo Pinheiro | GET | `/demandas` | Lista as demandas com filtros, busca e ordenação |
| Pedro Henrique Tafner Reck | POST | `/demandas` | Cadastra uma nova demanda |
| Pedro Henrique Tafner Reck | GET | `/projetos` | Lista os projetos |
| Arthur Cavallaro Paioli | GET | `/demandas/:id` | Mostra todos os campos de uma demanda |
| Arthur Cavallaro Paioli | GET | `/demandas/:id/comentarios` | Lista os comentários de uma demanda |
| Arthur Cavallaro Paioli | POST | `/demandas/:id/comentarios` | Cadastra um comentário na demanda |

**Códigos HTTP usados:**

| Código | Significado |
|---|---|
| 200 | Sucesso |
| 201 | Registro criado |
| 400 | Dados inválidos ou faltando (inclui JSON mal escrito) |
| 401 | Credenciais inválidas (login) |
| 404 | Registro ou rota não encontrada |
| 405 | Método não permitido (ex.: POST em /dashboard) |

**Usuários de teste** (para o login):

| E-mail | Senha | Perfil |
|---|---|---|
| ana@empresa.com | Admin@123 | Administrador |
| bruno@empresa.com | Lider@123 | Líder de Projeto |
| carla@empresa.com | Membro@123 | Membro da Equipe |
| carlos@empresa.com | Membro@123 | Membro da Equipe |

--------------------------------------------

## Login e usuários - Sophia de Souza Fabri

- **POST `/login`**: recebe `email` e `senha`.
  - 200: login correto, devolve os dados do usuário e o perfil, **sem a senha**.
  - 400: e-mail ou senha não informados.
  - 401: e-mail ou senha incorretos.
- **GET `/usuarios`**: lista os usuários cadastrados, **sem as senhas**.

## Dashboard - Sophia Dalla Bernardita Lopes

- **GET `/dashboard`**: retorna HTTP 200 e um JSON com total de demandas, contagem por status, prioridade e tipo, demandas críticas em aberto e demandas próximas do prazo.
- **Critério para "em aberto"**: status `Aberta`, `Em andamento` ou `Em revisão`. As demandas `Concluída` e `Cancelada` não entram nas listas de pendências.
- **Critério para "próximas do prazo"**: demandas em aberto com prazo de finalização de hoje até os próximos **7 dias corridos**, inclusive. Demandas já vencidas e sem prazo ficam fora dessa lista.
- **POST `/dashboard`**: retorna HTTP 405 (método não permitido), com mensagem de erro em JSON, para exemplificar o tratamento de uma requisição inválida.

## Listagem de demandas - João Felipe Bodo Pinheiro

- **GET `/demandas`**: lista as demandas com título, tipo, prioridade, status, projeto, responsável, data de criação e prazo (incluindo `nomeProjeto` e `nomeResponsavel`).
- **Filtros** (parâmetros na URL, podem ser combinados): `status`, `prioridade`, `tipo`, `idResponsavel` e `idProjeto`.
- **Busca textual**: `busca` procura no título ou na descrição, sem diferenciar maiúsculas e minúsculas.
- **Ordenação**: `ordenar` com `prioridade`, `dataCriacao`, `prazo` ou `status`.
  - 400: valor de ordenação inválido.
- Exemplo: `/demandas?status=Aberta&prioridade=Alta&busca=login&ordenar=prazo`

## Cadastro de demanda e projetos - Pedro Henrique Tafner Reck

- **POST `/demandas`**: recebe os campos abaixo.

| Campo | Obrigatório | Regra |
|---|---|---|
| `titulo` | Sim | Texto não vazio |
| `descricao` | Sim | Texto não vazio |
| `tipo` | Sim | `Tarefa`, `Defeito`, `Melhoria` ou `Documentação` |
| `prioridade` | Sim | `Crítica`, `Alta`, `Média` ou `Baixa` |
| `idProjeto` | Sim | Precisa ser o id de um projeto existente |
| `idResponsavel` | Não | Se informado, precisa ser o id de um usuário existente |
| `prazo` | Não | Se informado, no formato `AAAA-MM-DD` e com uma data que exista |

  - O **status** (`Aberta`), a **data de criação** e a **data da última atualização** são sempre definidos pelo servidor, mesmo que a requisição envie outros valores.
  - 201: demanda criada, devolve a demanda completa.
  - 400: dados inválidos, devolve a lista com todos os erros encontrados.
- **GET `/projetos`**: lista os projetos cadastrados.

## Detalhes da demanda e comentários - Arthur Cavallaro Paioli

- **GET `/demandas/:id`**: retorna todos os campos da demanda, com os dados do projeto e do responsável.
  - 404: demanda não existe.
- **GET `/demandas/:id/comentarios`**: lista os comentários da demanda, com o nome de quem comentou.
  - 404: demanda não existe.
- **POST `/demandas/:id/comentarios`**: recebe `idUsuario` e `texto`. A data e o horário são registrados pelo servidor.
  - 201: comentário criado.
  - 400: texto vazio, usuário não informado ou inexistente.
  - 404: demanda não existe.

--------------------------------------------

# Como testar as rotas (PowerShell ou cmd)

As rotas são testadas com o **curl**, que já vem instalado no Windows 10 e 11. Os comandos usam `curl.exe` (e não só `curl`) porque, no PowerShell, `curl` é um apelido para outro comando.

A lista completa, com a explicação de cada teste, está em [Codigo/Servidor/testes/comandos-de-teste.md](Codigo/Servidor/testes/comandos-de-teste.md).

## Preparando o terminal

1. Deixe o servidor ligado em um terminal (`npm start`).
2. Abra **outro** terminal e entre na pasta do servidor (os testes usam os arquivos da pasta `testes/`):
   ```
   cd "caminhodoprojetoPI-II-TIME-25CodigoServidor"
   ```
3. Rode uma vez, para os acentos aparecerem corretamente nas respostas:
   ```
   [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
   ```
   No cmd, use `chcp 65001` no lugar desse comando.

## Como o curl funciona

```
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/demanda-valida.json"
```

| Parte | Significado |
|---|---|
| `-i` | Mostra o código HTTP da resposta (200, 201, 400...) antes do JSON |
| `-X POST` | Método da requisição (sem ele, o curl faz GET) |
| `-H "Content-Type: application/json"` | Avisa o servidor que o corpo está em JSON |
| `-d "@testes/arquivo.json"` | Envia o conteúdo do arquivo como corpo da requisição |

**Dicas:**
- Quando a URL tiver `&` (vários filtros), ela **precisa** estar entre aspas duplas.
- Acentos na URL devem ser escritos codificados: `Crítica` vira `Cr%C3%ADtica`, `Média` vira `M%C3%A9dia` e espaço vira `%20`.
- Os corpos JSON ficam em arquivos na pasta `testes/` para evitar problemas com aspas e acentos no terminal.
- As respostas vêm formatadas (com quebras de linha), para facilitar a leitura.

## Testes de cada integrante

### Sophia de Souza Fabri - Login e usuários
```
curl.exe -i http://localhost:3000/usuarios
curl.exe -i -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "@testes/login-valido.json"
curl.exe -i -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "@testes/login-sem-senha.json"
curl.exe -i -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "@testes/login-senha-errada.json"
```
Esperado: 200, 200, **400** e **401**.

### Sophia Dalla Bernardita Lopes - Dashboard
```
curl.exe -i http://localhost:3000/dashboard
curl.exe -i -X POST http://localhost:3000/dashboard
```
Esperado: 200 e **405**.

### João Felipe Bodo Pinheiro - Listagem de demandas
```
curl.exe -i http://localhost:3000/demandas
curl.exe -i "http://localhost:3000/demandas?status=Aberta"
curl.exe -i "http://localhost:3000/demandas?status=Aberta&prioridade=Alta"
curl.exe -i "http://localhost:3000/demandas?prioridade=Cr%C3%ADtica"
curl.exe -i "http://localhost:3000/demandas?busca=login"
curl.exe -i "http://localhost:3000/demandas?ordenar=prioridade"
curl.exe -i "http://localhost:3000/demandas?ordenar=prazo"
curl.exe -i "http://localhost:3000/demandas?idResponsavel=3"
curl.exe -i "http://localhost:3000/demandas?idProjeto=2"
curl.exe -i "http://localhost:3000/demandas?ordenar=cor"
```
Esperado: 200 em todas, menos a última (**400**, ordenação inválida).

### Pedro Henrique Tafner Reck - Cadastro de demanda e projetos
```
curl.exe -i http://localhost:3000/projetos
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/demanda-valida.json"
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/demanda-status-ignorado.json"
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/demanda-vazia.json"
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/demanda-tipo-invalido.json"
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/demanda-projeto-inexistente.json"
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/demanda-prazo-invalido.json"
curl.exe -i -X POST http://localhost:3000/demandas -H "Content-Type: application/json" -d "@testes/json-quebrado.json"
```
Esperado: 200, 201, 201 (com status `Aberta` mesmo enviando `Concluída`), **400**, **400**, **400**, **400** e **400**.

Para mostrar que a demanda cadastrada aparece na listagem:
```
curl.exe -i "http://localhost:3000/demandas?busca=nova%20tela"
```

### Arthur Cavallaro Paioli - Detalhes da demanda e comentários
```
curl.exe -i http://localhost:3000/demandas/1
curl.exe -i http://localhost:3000/demandas/999
curl.exe -i http://localhost:3000/demandas/1/comentarios
curl.exe -i -X POST http://localhost:3000/demandas/1/comentarios -H "Content-Type: application/json" -d "@testes/comentario-valido.json"
curl.exe -i -X POST http://localhost:3000/demandas/1/comentarios -H "Content-Type: application/json" -d "@testes/comentario-vazio.json"
curl.exe -i -X POST http://localhost:3000/demandas/999/comentarios -H "Content-Type: application/json" -d "@testes/comentario-valido.json"
```
Esperado: 200, **404**, 200, 201, **400** e **404**.

### Geral
```
curl.exe -i http://localhost:3000/
curl.exe -i http://localhost:3000/rotaquenaoexiste
```
Esperado: 200 e **404** (rota não encontrada).
