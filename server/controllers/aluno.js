import AlunoService from '../services/aluno';

export default {
  buscar(req, res) {
    return AlunoService
      .buscarPorEmail(req.query.email)
      .then(usuario => res.status(200).send(usuario))
      .catch(error => res.status(400).send(error));
  },
};
