import AlunoService from '../services/aluno';

export function login(req, res) {
  res.send({ token: AlunoService.gerarToken(req.usuario) });
}

export function cadastrar(req, res) {
  console.log('DEBUG req.body', req.body);
  res.send({ 'DEBUG req.body': req.body });
}

export default {
  login,
  cadastrar,
};
