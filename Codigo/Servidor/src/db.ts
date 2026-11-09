/*
    Conexão com o banco de dados Oracle (pool de conexões)

    Autor: Pedro Tafner
    
*/

import oracledb from "oracledb";
import "dotenv/config"; // Lê o arquivo .env e coloca os valores em process.env

// Dados de acesso ao banco, lidos do arquivo .env
const {
  ORACLE_HOST,
  ORACLE_PORT,
  ORACLE_SERVICE,
  ORACLE_USER,
  ORACLE_PASSWORD
} = process.env;

// Endereço completo do banco no formato servidor:porta/serviço
const connectString = `${ORACLE_HOST}:${ORACLE_PORT}/${ORACLE_SERVICE}`;

// Faz as consultas devolverem objetos ({ NOME: "Ana" }) em vez de listas ([ "Ana" ])
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Cria o pool: um grupo de conexões abertas que as rotas reaproveitam
// (chamado uma única vez, quando o servidor liga)
export async function initPool() {
  await oracledb.createPool({
    user: ORACLE_USER,
    password: ORACLE_PASSWORD,
    connectString,
    poolMin: 1,       // mínimo de conexões mantidas ativas
    poolMax: 10,      // máximo permitido simultaneamente
    poolIncrement: 1  // crescimento gradual conforme a demanda
  });
}

// Pega emprestada uma conexão do pool (depois de usar, é preciso devolver com close())
export async function getConn() {
  return oracledb.getPool().getConnection();
}

// Fecha o pool e todas as conexões (chamado quando o servidor desliga)
export async function closePool() {
  try {
    await oracledb.getPool().close(10);
  } catch {
    /* pool pode não existir, ignore */
  }
}
