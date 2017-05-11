import {} from 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import conectarBD from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

// Logger
app.use(morgan('dev'));

// Bibliotecas de terceiros
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

const inicializarBd = () => {
	// Conectar ao banco de dados
	conectarBD().then(() => {
		// Middlewares
		app.use(middleware(config));

		// Rotas da API
		app.use('/', api());

		app.server.listen(process.env.PORT || config.port);

		console.log(`Started on port ${app.server.address().port}`);

	}).catch(err => {
		console.log(`Não foi possivel connectar ao banco MySQL. Erro: ${err}`);
		setTimeout(inicializarBd, 5000);
	});
};

inicializarBd();


export default app;
