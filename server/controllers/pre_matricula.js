import PreMatriculaService from '../services/pre_matricula';

export default {
  disciplinasDisponiveisSomenteVeteranos(req, res) {
    console.log("req.params: ", req.params)
    return PreMatriculaService
      .disciplinasDisponiveisSomenteVeteranos(req.params)
      .then(configuracao => res.status(200).send(configuracao))
      .catch(error => res.status(400).send(error));
  },
};
