import PreMatriculaService from '../services/pre_matricula';

export default {

  buscarPreMatriculas(req, res) {
    return PreMatriculaService
      .buscarPreMatriculas(req.user.id_aluno)
      .then(preMatriculas => res.status(200).send(preMatriculas))
      .catch(error => res.status(400).send(error));
  },

  registrarPreMatricula(req, res) {
    return PreMatriculaService
      .registrarPreMatricula(req.user, req.params.id_disciplina, req.body.turma, req.body.status)
      .then(disciplinas => res.status(200).send(disciplinas))
      .catch(error => res.status(400).send(error));
  },

  disciplinasDisponiveis(req, res) {
    return PreMatriculaService
      .disciplinasDisponiveis(req.user)
      .then(disciplinas => res.status(200).send(disciplinas))
      .catch(error => res.status(400).send(error));
  },

  disciplinaDisponivel(req, res) {
    return PreMatriculaService
      .disciplinasDisponiveis(req.user, req.params.id_disciplina)
      .then(disciplina => res.status(200).send(disciplina))
      .catch(error => res.status(400).send(error));
  },
};
