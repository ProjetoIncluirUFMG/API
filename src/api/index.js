import { version } from '../../package.json';
import { Router } from 'express';
import curso from './curso';
import usuario from './usuario';

export default () => {
	let api = Router();

	api.use('/curso', curso());

	api.use('/usuario', usuario());

	// Expor metadados na raiz do projeto
	api.get('/api', (req, res) => {
		res.json({ version });
	});

	return api;
}
