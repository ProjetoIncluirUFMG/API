import resource from 'resource-router-middleware';
import Curso from '../models/curso';

export default () => resource({

	/** GET / - Listar todas as entidades */
	list({ params, query }, res) {
		Curso.buscarTodos().then(cursos => {
			res.json(cursos);
		});
	},

});
