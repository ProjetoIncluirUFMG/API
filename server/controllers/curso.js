import CursoService from '../services/curso';

export default {
  lista(req, res) {
    return CursoService
      .listarTodos()
      .then(cursos => res.status(200).send(cursos))
      .catch(error => res.status(400).send(error));
  },
};
