import passport from 'passport';
import {} from '../services/passport';

import Controllers from '../controllers';

const requereAutenticacao = passport.authenticate('jwt', { session: false });
const requereCadastro = passport.authenticate('local', { session: false });

const CursoController = Controllers.curso;
const AlunoController = Controllers.aluno;
const AutenticacaoController = Controllers.autenticacao;

module.exports = (app) => {
  app.get('/', requereAutenticacao, (req, res) => {
    res.send({ mensagem: 'Codigo secreto!' });
  });
  app.get('/cursos', CursoController.lista);
  app.post('/usuario/cadastrar', requereCadastro, AutenticacaoController.cadastrar);
  app.post('/usuario/login', AutenticacaoController.login);
  app.get('/usuario', AlunoController.buscar);
};
