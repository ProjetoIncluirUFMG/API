import resource from 'resource-router-middleware';
import cursos from '../models/cursos';
import db, { query } from '../db';

export default () => resource({

	/* Nome da propriedade para armazenar um entidade pre carregada dentro da "request" */
	id : 'curso',


	/** Para requisições com um "id", você pode auto-carregar a entidade.
	 *  Errors terminam a requisição, caso sucesso, vamos setar "req[id] = data".
	 */
	load(req, id, callback) {
		let curso = cursos.find( curso => curso.id === id ),
				err = curso ? null : 'Not found';
		callback(err, curso);
	},

	/** GET / - Listar todas as entidades */
	index({ params }, res) {
		const options = {
			sql: 'SELECT * FROM curso' + 
			' LEFT JOIN disciplina ON curso.id_curso = disciplina.id_curso' +
			' WHERE curso.status=1 AND disciplina.status=1' +
			' ORDER BY curso.id_curso, disciplina.nome_disciplina'
		};
		query(options).then(cursos => {
			res.json(cursos);
		});
	},

	/** POST / - Criar nova entidade */
	create({ body }, res) {
		body.id = cursos.length.toString(36);
		cursos.push(body);
		res.json(body);
	},

	/** GET /:id - Retorna uma entidade específica */
	read({ curso }, res) {
		res.json(curso);
	},

	/** PUT /:id - Atualiza uma entidade específica */
	update({ curso, body }, res) {
		for (let key in body) {
			if (key !== 'id') {
				curso[key] = body[key];
			}
		}
		res.sendStatus(204);
	},

	/** DELETE /:id - Deleta uma entidade específica */
	delete({ curso }, res) {
		cursos.splice(cursos.indexOf(curso), 1);
		res.sendStatus(204);
	}
});
