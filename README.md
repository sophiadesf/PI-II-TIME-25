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

### Dashboard - autoria: Sophia D B Lopes

- **Critério para "em aberto"**: status `Aberta`, `Em andamento` ou `Em revisão`. As demandas `Concluída` e `Cancelada` não entram nas listas de pendências.
- **GET `/dashboard`**: retorna HTTP 200 e um JSON com total de demandas, contagem por status, prioridade e tipo, demandas críticas em aberto e demandas próximas do prazo.
- **Critério para "próximas do prazo"**: demandas em aberto com prazo de finalização de hoje até os próximos **7 dias corridos**, inclusive. Demandas já vencidas e sem prazo ficam fora dessa lista.
- **POST `/dashboard`**: retorna HTTP 405 (método não permitido), com mensagem de erro em JSON, para exemplificar o tratamento de uma requisição inválida.

**Testes da rota** (com o servidor ligado):

```bash
curl -i http://localhost:3000/dashboard
curl -i -X POST http://localhost:3000/dashboard
````