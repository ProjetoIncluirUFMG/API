import BD from '../models';

export default {
  lista(req, res) {
    return BD.Curso
      .findAll()
      .then((cursos) => res.status(200).send(cursos))
      .catch((error) => res.status(400).send(error));
  },
};
