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