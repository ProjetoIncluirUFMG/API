import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './server/routes';

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);
app.get('*', (req, res) => res.status(200).send({
  mensagem: 'Bem vindo a API do Projeto Incluir!',
}));

module.exports = app;
