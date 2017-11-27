import BD from '../models';
import AlunoService from './aluno';

const { PreMatricula, DisciplinaPreRequisito } = BD;


export default class PreMatriculaService {
  static disponibilidadeDeVaga({
    id_disciplina,
    id_aluno,
  }) {
    return PreMatricula.findOne({
      where: {
        id_disciplina,
        id_aluno,
      },
    }).then((preMatricula) => {
      if (preMatricula) {
        return {
          disponibilidade: false,
          razao: 'Aluno já matriculado!',
        };
      }

      return DisciplinaPreRequisito.findAll({
        where: {
          id_disciplina,
        },
      }).then((disciplinasPreRequisito) => {
        console.log("id_aluno: ", id_aluno);
        if (disciplinasPreRequisito.length > 0) {
          return AlunoService.eVeterano();
        }
        return disciplinasPreRequisito;
      });
    });
  }
}
