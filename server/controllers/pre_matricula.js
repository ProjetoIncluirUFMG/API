import PreMatriculaService from '../services/pre_matricula';

export default {
  disciplinasDisponiveis(req, res) {
    return PreMatriculaService
      .disciplinasDisponiveis(req.user)
      .then(disciplinas => res.status(200).send(disciplinas))
      .catch(error => res.status(400).send(error));
  },
};
