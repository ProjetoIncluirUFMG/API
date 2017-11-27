import AlunoService from '../services/aluno';

export default {
  login(req, res) {
    res.send(AlunoService.gerarToken(req.user));
  },
};
