import BD from '../models';
import DesciplinaService from './disciplina';
import AlunoService from './aluno';
import CursoService from './curso';
import ConfiguracaoService from './configuracao';

const { PreMatricula } = BD;

const STATUS = {
  FILA_DE_ESPERA: 'FilaDeEspera',
  FILA_DE_NIVELAMENTO: 'FilaDeNivelamento',
  VAGA_NO_CURSO: 'VagaNoCurso',
};

const TURNOS = {
  MANHA: 'Manha',
  TARDE: 'Tarde',
};

export default class PreMatriculaService {
  static buscarTurnosValidos(turnoPreMatriculas) {
    const turnosDisponiveis = [];
    if (!turnoPreMatriculas.Manha) {
      turnosDisponiveis.push(TURNOS.MANHA);
    }
    if (!turnoPreMatriculas.Tarde) {
      turnosDisponiveis.push(TURNOS.TARDE);
    }
    return turnosDisponiveis;
  }

  static criarMapaPreMatricula(preMatriculas) {
    const turnoPreMatriculas = {};
    preMatriculas.forEach((preMatricula) => {
      if (preMatricula.turno === TURNOS.MANHA) {
        turnoPreMatriculas.Manha = preMatricula;
      } else if (preMatricula.turno === TURNOS.TARDE) {
        turnoPreMatriculas.Tarde = preMatricula;
      }
    });
    return turnoPreMatriculas;
  }

  static disciplinasDisponiveis(aluno) {
    return ConfiguracaoService.buscar().then((configuracao) => {
      if (configuracao.somente_veterano) {
        return PreMatriculaService.disciplinasDisponiveisSomenteVeteranos(aluno);
      }
      return PreMatriculaService.disciplinasDisponiveisTodos(aluno);
    });
  }

  static disciplinasDisponiveisTodos(aluno) {
    const idadeAluno = AlunoService.calcularIdade(new Date(aluno.data_nascimento));
    let turnoPreMatriculas = {};

    return PreMatriculaService.buscarPreMatriculas(aluno.id_aluno)
      .then((preMatriculas) => {
        // Caso aluno já tenha registrado duas matriculas,
        if (preMatriculas.length === 2) {
          return {};
        }
        // Buscar pre cadastros previamente realizados
        turnoPreMatriculas = PreMatriculaService.criarMapaPreMatricula(preMatriculas);

        return CursoService.listarTodos();
      }).then((cursos) => {
        const disciplinas = {};
        cursos.forEach((curso) => {
          curso.disciplinas.forEach((disciplina) => {
            let status = null;
            if (idadeAluno >= disciplina.idade_minima) {
              if (disciplina.total_vagas_do_curso > disciplina.vagas_do_curso &&
                  disciplina.pre_disciplinas.length === 0) {
                status = STATUS.VAGA_NO_CURSO;
              } else if (disciplina.total_fila_de_nivelamento >
                 disciplina.fila_de_nivelamento && disciplina.pre_disciplinas.length > 0) {
                status = STATUS.FILA_DE_NIVELAMENTO;
              } else if (disciplina.total_fila_de_espera > disciplina.fila_de_espera) {
                status = STATUS.FILA_DE_ESPERA;
              }
            }
            if (status !== null) {
              disciplinas[disciplina.id_disciplina] = {
                status,
                turnos: PreMatriculaService.buscarTurnosValidos(turnoPreMatriculas),
              };
            }
          });
        });
        return PreMatriculaService.disciplinasDisponiveisSomenteVeteranos(aluno)
          .then((disciplinasVeterano) => {
            Object.keys(disciplinasVeterano).forEach((disciplinaVeteranoId) => {
              disciplinas[disciplinaVeteranoId] = disciplinasVeterano[disciplinaVeteranoId];
            });
            return disciplinas;
          });
      }).catch(error => error);
  }

  static disciplinasDisponiveisSomenteVeteranos(aluno) {
    const idadeAluno = AlunoService.calcularIdade(new Date(aluno.data_nascimento));

    return PreMatriculaService.buscarPreMatriculas(aluno.id_aluno)
      .then((preMatriculas) => {
        // Caso aluno já tenha registrado duas matriculas,
        if (preMatriculas.length === 2) {
          return {};
        }
        // Buscar pre cadastros previamente realizados
        const turnoPreMatriculas = PreMatriculaService.criarMapaPreMatricula(preMatriculas);

        return DesciplinaService.buscarEmCurso(aluno.id_aluno).then((periodo) => {
          if (!periodo) {
            return {};
          }
          let proximasDisciplinasComVagaOuFila = [];
          const totalDeAulasNoSemestre = periodo.data_funcionamentos.length;

          periodo.turmas.filter(turma =>
            turma.disciplina.proximas_disciplinas &&
            turma.disciplina.proximas_disciplinas.length > 0,
          ).forEach((turma) => {
            // Calcular presença do aluno e validar se o mesmo tem no mínimo 50% por disciplina
            const totalDeFaltasNoSemestre = turma.turma_alunos[0].faltas.length;
            const porcentagemDeFalta = (totalDeFaltasNoSemestre * 100) / totalDeAulasNoSemestre;
            const porcentagemDePresencaMinima = 50;

            if (porcentagemDeFalta > porcentagemDePresencaMinima) {
              return;
            }
            // Checar idade mínima comparado com a idade do aluno para realizar o curso
            // Descorbrir se o proximo curso tem vagas diretas, ou vagas na fila de espera
            const disciplinasComVagasNoCurso = turma.disciplina.proximas_disciplinas
              .filter(({ disciplina }) =>
                disciplina.total_vagas_do_curso > disciplina.vagas_do_curso &&
                idadeAluno >= disciplina.idade_minima)
              .map(({ disciplina }) => (
                {
                  ...disciplina.dataValues,
                  status: STATUS.VAGA_NO_CURSO,
                  turnos: PreMatriculaService.buscarTurnosValidos(turnoPreMatriculas),
                }
              ));
            const disciplinasComFilasDeEspera = turma.disciplina.proximas_disciplinas
              .filter(({ disciplina }) =>
                disciplinasComVagasNoCurso.filter(disciplinaComVagasNoCurso =>
                  disciplina.id_disciplina === disciplinaComVagasNoCurso.id_disciplina,
                ).length === 0 &&
                disciplina.total_fila_de_espera > disciplina.fila_de_espera &&
                idadeAluno >= disciplina.idade_minima,
              )
              .map(({ disciplina }) => (
                {
                  ...disciplina.dataValues,
                  status: STATUS.FILA_DE_ESPERA,
                  turnos: PreMatriculaService.buscarTurnosValidos(turnoPreMatriculas),
                }
              ));

            if (disciplinasComVagasNoCurso.length > 0 ||
                disciplinasComFilasDeEspera.length > 0) {
              proximasDisciplinasComVagaOuFila = proximasDisciplinasComVagaOuFila
                .concat(disciplinasComVagasNoCurso)
                .concat(disciplinasComFilasDeEspera);
            }
          });
          const disciplinasComVagaOuFila = {};
          proximasDisciplinasComVagaOuFila.forEach((ret) => {
            disciplinasComVagaOuFila[ret.id_disciplina] = {
              status: ret.status,
              turnos: ret.turnos,
            };
          });
          return disciplinasComVagaOuFila;
        });
      }).catch(error => error);
  }

  static buscarPreMatriculas(idAluno) {
    return PreMatricula.findAll({
      where: {
        id_aluno: idAluno,
        vaga_garantida: true,
      },
    }).then((preMatriculas) => {
      if (!preMatriculas) {
        return [];
      }
      return preMatriculas;
    });
  }
}
