import AlunoService from '../services/aluno';

export default {
  login(req, res) {
    res.send({ jwt: AlunoService.gerarToken(req.user) });
  },
};
