import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config';

const configBD = config.bd;
const nomeBase = path.basename(module.filename);
const bd = {};

// Conectar ao banco de dados
const sequelize = new Sequelize(`${configBD.dialeto}://${configBD.usuario}:${configBD.senha}@${configBD.host}:${configBD.porta}/${configBD.banco}`);

// Testar conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => console.log('API conectou com sucesso com o Banco de Dados.'))
  .catch(err => console.log('Não foi possivel conectar ao Banco de Dados:', err));

// Carregar tabelas
fs
  .readdirSync(__dirname)
  .filter(arquivo =>
    (arquivo.indexOf('.') !== 0) &&
    (arquivo !== nomeBase) &&
    (arquivo.slice(-3) === '.js'))
  .forEach((arquivo) => {
    const modelo = sequelize.import(path.join(__dirname, arquivo));
    bd[modelo.name] = modelo;
  });

// Criar associação entre tabelas
Object.keys(bd).forEach((nomeModelo) => {
  if (bd[nomeModelo].associar) {
    bd[nomeModelo].associar(bd);
  }
});

bd.sequelize = sequelize;
bd.Sequelize = Sequelize;

export default bd;

// Funções para suporte
export function criarOuAtualizar(modelo, valores, condicao) {
  return modelo
    .findOne({ where: condicao })
    .then((obj) => {
      if (obj) return obj.update(valores);
      return modelo.create(valores);
    });
}
