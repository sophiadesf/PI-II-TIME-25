# 🚀 Sistema de Acompanhamento de Demandas de Desenvolvimento
---
  Projeto Integrador II • Engenharia de Software • 2º Semestre de 2026
---

## 👥 Integrantes (Grupo 25)

- **Arthur Cavallaro Paioli**
- **João Felipe Bodo Pinheiro**
- **Pedro Henrique Tafner Reck**
- **Sophia Dalla Bernardina Lopes**
- **Sophia de Souza Fabri**

---

## 🏫 Dados Acadêmicos

- **Curso:** Engenharia de Software
- **Projeto Integrador:** II
- **Semestre / Ano:** 2º Semestre / 2026
- **Professora Orientadora:** Renata Arantes

---

## 💡 Sobre o Projeto

O **Sistema de Acompanhamento de Demandas de Desenvolvimento** é uma aplicação voltada para o registro, gerenciamento e acompanhamento de demandas de equipes de desenvolvimento (como tarefas, defeitos, melhorias e documentação). 

Nesta etapa do projeto, a aplicação conta com:
- **Frontend** estruturado em telas interativas utilizando tecnologias web padrão.
- **Backend (API REST)** desenvolvido em Node.js com TypeScript para gerenciamento das regras de negócio.
- *Nota atual:* Os dados são persistidos **em memória** (através de um arquivo centralizado de dados). Ao reiniciar o servidor, as informações retornam ao estado inicial. A persistência definitiva em banco de dados e a integração completa com as telas ocorrerão nas próximas etapas.

---

## 🛠️ Tecnologias

As seguintes ferramentas e tecnologias foram utilizadas no desenvolvimento do projeto:

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** 
  - [Node.js](https://nodejs.org/) (Ambiente de execução JavaScript)
  - [Express](https://expressjs.com/) (Framework web)
  - [TypeScript](https://www.typescriptlang.org/) (Superset JavaScript tipado)
- **Ferramentas de Apoio:** Git, GitHub, ts-node-dev

---

## 📂 Estrutura do Repositório

```text
PI-II-TIME-25/
├── Codigo/
│   ├── Servidor/         # Backend da aplicação (API Node.js + TypeScript)
│   │   ├── src/          # Código-fonte em TypeScript
│   │   ├── package.json  # Dependências e scripts do servidor
│   │   └── ...
│   └── (Arquivos do Frontend - Telas HTML/CSS/JS)
└── README.md
