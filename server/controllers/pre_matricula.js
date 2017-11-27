import PreMatriculaService from '../services/pre_matricula';

export default {
  disponibilidade(req, res) {
    return PreMatriculaService
      .disponibilidadeDeVaga(req.params)
      .then(configuracao => res.status(200).send(configuracao))
      .catch(error => res.status(400).send(error));
  },
};
