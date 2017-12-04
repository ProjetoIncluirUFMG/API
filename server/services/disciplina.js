import BD from '../models';

const { DisciplinaPreRequisito, DataFuncionamento, Aluno, Periodo, Turma,
  Disciplina, TurmaAluno, Falta } = BD;

export default class DisciplinaService {
  static buscarPreRequisitos(idDisciplina) {
    return DisciplinaPreRequisito.findAll({
      where: {
        id_disciplina: idDisciplina,
      },
    }).then((disciplinasPreRequisito) => {
      if (!disciplinasPreRequisito) {
        return [];
      }
      return disciplinasPreRequisito;
    });
  }

  static buscarEmCurso(idAluno) {
    return Periodo.findOne({
      include: [{
        model: Turma,
        as: 'turmas',
        where: {},
        include: [{
          model: TurmaAluno,
          as: 'turma_alunos',
          where: {
            id_aluno: idAluno,
          },
          include: [{
            model: Falta,
            as: 'faltas',
          }, {
            model: Aluno,
            as: 'alunos',
          }],
        },
        {
          model: Disciplina,
          as: 'disciplina',
          include: [{
            model: DisciplinaPreRequisito,
            as: 'proximas_disciplinas',
            include: [{
              model: Disciplina,
              as: 'disciplina',
            }],
          }],
        }],
      }, {
        model: DataFuncionamento,
        as: 'data_funcionamentos',
        where: {},
      }],
      where: {
        is_atual: true,
      },
    })
      .then(periodo => periodo)
      .catch(error => error);
  }
}
