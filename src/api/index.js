import { version } from '../../package.json';
import { Router } from 'express';
import cursos from './cursos';

export default () => {
	let api = Router();

	api.use('/cursos', cursos());

	// Expor metadados na raiz do projeto
	api.get('/api', (req, res) => {
		res.json({ version });
	});

	return api;
}
