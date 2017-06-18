import BD from '../models';

const Curso = BD.Curso;
const Disciplina = BD.Disciplina;

export default class CursoService {
  static listarTodos() {
    return Curso
      .findAll({
        include: [{
          model: Disciplina,
          as: 'disciplinas',
        }],
        where: {
          '$Curso.status$': 1,
          '$disciplinas.status$': 1,
        },
      })
      .then(cursos => cursos)
      .catch(error => error);
  }
}
