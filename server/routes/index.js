import passport from 'passport';
import {} from '../services/passport';

import Controllers from '../controllers';

const requerAutenticacaoJWT = passport.authenticate('jwt', { session: false });
const requerAutenticacaoLocal = passport.authenticate('local', { session: false });

const ConfiguracaoController = Controllers.configuracao;
const CursoController = Controllers.curso;
const AlunoController = Controllers.aluno;
const AutenticacaoController = Controllers.autenticacao;
const PreMatriculaController = Controllers.preMatricula;

export default (app) => {
  // Validar se API esta ativa (controle através do sistema de administrador)
  app.use(ConfiguracaoController.validarSeAPIAtiva);

  app.get('/', (req, res) => {
    res.send({ apiAtiva: true });
  });
  // requerAutenticacaoJWT,
  app.get('/usuario/disciplinasDisponiveis', requerAutenticacaoJWT, PreMatriculaController.disciplinasDisponiveis);
  app.get('/configuracao', ConfiguracaoController.buscar);
  app.get('/cursos', CursoController.lista);
  app.post('/usuario/cadastrar', AlunoController.cadastrar);
  app.post('/usuario/login', requerAutenticacaoLocal, AutenticacaoController.login);
  app.post('/usuario/recuperarSenha', AlunoController.recuperarSenha);
  app.post('/usuario/resetarSenha', AlunoController.resetarSenha);
  app.get('/usuario/temDependente', AlunoController.temDependente);
  app.get('/usuario', AlunoController.buscar);
};
