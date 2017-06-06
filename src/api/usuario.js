import resource from 'resource-router-middleware';
import Usuario from '../models/usuario';

export default () => resource({

	/** GET / - Listar todas as entidades */
	list({ params, query }, res) {
		const email = query.email;
		Usuario.buscarPorEmail(email).then(usuario => {
			res.json(usuario);
		});
	},


});
