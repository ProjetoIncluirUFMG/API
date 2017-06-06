import mysql from 'promise-mysql';
import util from 'util';

const MYSQL_DB = process.env.MYSQL_DB;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = process.env.MYSQL_PORT;

let conexaoBD = null;

export function connect() {

	console.log(`JSON para conecatar com o BD: ${util.inspect({
		host: MYSQL_HOST,
		port: MYSQL_PORT,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: MYSQL_DB
	}, {showHidden: false, depth: null})}`);

	return mysql.createConnection({
		host: MYSQL_HOST,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: MYSQL_DB
	}).then(conexao => {
		conexaoBD = conexao;
	});

}

export function busca(opcoes) {
	return conexaoBD.query(opcoes).then((resultado) => {
		//console.log(`Resultado da busca ${opcoes.sql} foi: ${util.inspect(resultado, {showHidden: false, depth: null})}`);
		return resultado;
	}).catch(err => {
		console.log(`Erro ao executar query: ${opcoes.sql} - erro: ${err}`);
		throw err;
	});
}

export default connect;
