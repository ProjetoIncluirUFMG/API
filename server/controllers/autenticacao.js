import AlunoService from '../services/aluno';

export function login(req, res) {
  res.send({ token: AlunoService.gerarToken(req.usuario) });
}

export function cadastrar(req, res) {
  // TODO atualizar tabela de usuarios e criar senha bcript
  AlunoService.cadastrar(req.body)
  .then(usuario => res.status(200).send(usuario))
  .catch(error => res.status(400).send(error));
}

export default {
  login,
  cadastrar,
};
