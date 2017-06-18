import {} from 'dotenv/config';
import http from 'http';
import app from '../app';

const port = parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Servidor inicializado na porta ${port}`);
});
