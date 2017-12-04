import BD from '../models';

const { Curso, Disciplina, DisciplinaPreRequisito } = BD;

export default class CursoService {
  static listarTodos() {
    return Curso
      .findAll({
        include: [{
          model: Disciplina,
          as: 'disciplinas',
          include: [{
            model: DisciplinaPreRequisito,
            as: 'pre_disciplinas',
          }],
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
