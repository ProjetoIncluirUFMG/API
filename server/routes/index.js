import passport from 'passport';
import {} from '../services/passport';

import Controllers from '../controllers';

const requereAutenticacaoJWT = passport.authenticate('jwt', { session: false });
const requereAutenticacaoLocal = passport.authenticate('local', { session: false });

const CursoController = Controllers.curso;
const AlunoController = Controllers.aluno;
const AutenticacaoController = Controllers.autenticacao;

module.exports = (app) => {
  app.get('/', requereAutenticacaoJWT, (req, res) => {
    res.send({ mensagem: 'Codigo secreto!' });
  });
  app.get('/cursos', CursoController.lista);
  app.post('/usuario/cadastrar', AutenticacaoController.cadastrar);
  app.post('/usuario/login', requereAutenticacaoLocal, AutenticacaoController.login);
  app.get('/usuario', AlunoController.buscar);
};
