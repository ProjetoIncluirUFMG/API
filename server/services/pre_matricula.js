import BD from '../models';
import DesciplinaService from './disciplina';

const { PreMatricula } = BD;

export default class PreMatriculaService {
  static disciplinasDisponiveisSomenteVeteranos({
    id_usuario,
  }) {
    return DesciplinaService.buscarEmCurso(id_usuario);
  }

  static buscarPreMatriculas(idAluno) {
    // Validar
    return PreMatricula.findAll({
      where: {
        id_aluno: idAluno,
      },
    }).then((preMatriculas) => {
      if (!preMatriculas) {
        return [];
      }
      return preMatriculas;
    });
  }
}
