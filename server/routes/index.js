import passport from 'passport';
import {} from '../services/passport';

import Controllers from '../controllers';

const requerAutenticacaoJWT = passport.authenticate('jwt', { session: false });
const requerAutenticacaoLocal = passport.authenticate('local', { session: false });

const CursoController = Controllers.curso;
const AlunoController = Controllers.aluno;
const AutenticacaoController = Controllers.autenticacao;

export default (app) => {
  app.get('/', requerAutenticacaoJWT, (req, res) => {
    res.send({ mensagem: 'Codigo secreto!' });
  });
  app.get('/cursos', CursoController.lista);
  app.post('/usuario/cadastrar', AlunoController.cadastrar);
  app.post('/usuario/login', requerAutenticacaoLocal, AutenticacaoController.login);
  app.post('/usuario/recuperarSenha', AlunoController.recuperarSenha);
  app.post('/usuario/resetarSenha', AlunoController.resetarSenha);
  app.get('/usuario', AlunoController.buscar);
};
