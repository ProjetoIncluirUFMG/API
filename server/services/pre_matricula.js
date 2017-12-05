import BD, { criar } from '../models';
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

const TURMAS = {
  PRIMEIRA: '8:00 - 10:00',
  SEGUNDA: '10:30 - 12:30',
};

export default class PreMatriculaService {
  static buscarTurmasValidos(turmaPreMatriculas) {
    const turmasDisponiveis = [];
    if (!turmaPreMatriculas.PRIMEIRA) {
      turmasDisponiveis.push(TURMAS.PRIMEIRA);
    }
    if (!turmaPreMatriculas.SEGUNDA) {
      turmasDisponiveis.push(TURMAS.SEGUNDA);
    }
    return turmasDisponiveis;
  }

  static criarMapaPreMatricula(preMatriculas) {
    const turmaPreMatriculas = {};
    preMatriculas.forEach((preMatricula) => {
      if (preMatricula.turma === TURMAS.PRIMEIRA) {
        turmaPreMatriculas.PRIMEIRA = preMatricula;
      } else if (preMatricula.turma === TURMAS.SEGUNDA) {
        turmaPreMatriculas.SEGUNDA = preMatricula;
      }
    });
    return turmaPreMatriculas;
  }

  static registrarPreMatricula(aluno, idDisciplina, turma, status) {
    return PreMatriculaService.disciplinasDisponiveis(aluno, idDisciplina).then((disciplina) => {
      // Disciplina esta disponivel para pre matricula
      if (disciplina &&
          disciplina[idDisciplina] &&
          disciplina[idDisciplina].status === status &&
          disciplina[idDisciplina].turmas.indexOf(turma) > -1) {
        const preMatricula = {
          data_modificado: new Date(),
          numero_comprovante: `${idDisciplina}${aluno.id_aluno}`,
          turma,
          id_aluno: aluno.id_aluno,
          cpf_aluno: aluno.cpf,
          nome_aluno: aluno.nome_aluno,
          id_disciplina: idDisciplina,
          nome_disciplina: disciplina[idDisciplina].nome,
          veterano: disciplina[idDisciplina].veterano,
          vaga_garantida: disciplina[idDisciplina].status === STATUS.VAGA_NO_CURSO,
          fila_de_nivelamento: disciplina[idDisciplina].status === STATUS.FILA_DE_NIVELAMENTO,
          fila_de_espera: disciplina[idDisciplina].status === STATUS.FILA_DE_ESPERA,
          status: 'Ativo',
        };
        return criar(PreMatricula, preMatricula).then((preMatriculaRet) => {
          let promise = null;
          if (preMatricula.vaga_garantida) {
            promise = DesciplinaService.atualizarTotalDeVagas(preMatriculaRet.id_disciplina, 'vagas_do_curso');
          } else if (preMatricula.fila_de_nivelamento) {
            promise = DesciplinaService.atualizarTotalDeVagas(preMatriculaRet.id_disciplina, 'fila_de_nivelamento');
          } else if (preMatricula.fila_de_espera) {
            promise = DesciplinaService.atualizarTotalDeVagas(preMatriculaRet.id_disciplina, 'fila_de_espera');
          }
          return promise.then(() => preMatriculaRet);
        });
      }
      throw new Error('Disciplina indisponível para cadastro!');
    });
  }

  static disciplinasDisponiveis(aluno, idDisciplina) {
    return ConfiguracaoService.buscar().then((configuracao) => {
      if (configuracao.somente_veterano) {
        return PreMatriculaService.disciplinasDisponiveisSomenteVeteranos(aluno, idDisciplina);
      }
      return PreMatriculaService.disciplinasDisponiveisTodos(aluno, idDisciplina);
    });
  }

  static disciplinasDisponiveisTodos(aluno, idDisciplina) {
    const idadeAluno = AlunoService.calcularIdade(new Date(aluno.data_nascimento));
    let turmaPreMatriculas = {};
    let preMatriculasIds = [];

    return PreMatriculaService.buscarPreMatriculas(aluno.id_aluno)
      .then((preMatriculas) => {
        // Caso aluno já tenha registrado duas matriculas,
        if (preMatriculas.length === 2) {
          return {};
        }
        // Buscar pre cadastros previamente realizados
        turmaPreMatriculas = PreMatriculaService.criarMapaPreMatricula(preMatriculas);
        preMatriculasIds = preMatriculas.map(preMatricula => preMatricula.id_disciplina);

        if (idDisciplina) {
          return CursoService.listarDisciplina(idDisciplina);
        }
        return CursoService.listarTodos();
      }).then((cursos) => {
        const disciplinas = {};
        cursos.forEach((curso) => {
          curso.disciplinas.forEach((disciplina) => {
            let status = null;
            if (idadeAluno >= disciplina.idade_minima &&
              preMatriculasIds.indexOf(disciplina.id_disciplina) === -1) {
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
                turmas: PreMatriculaService.buscarTurmasValidos(turmaPreMatriculas),
                nome: disciplina.nome_disciplina,
                veterano: false,
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

  static disciplinasDisponiveisSomenteVeteranos(aluno, idDisciplina) {
    const idadeAluno = AlunoService.calcularIdade(new Date(aluno.data_nascimento));

    return PreMatriculaService.buscarPreMatriculas(aluno.id_aluno)
      .then((preMatriculas) => {
        // Caso aluno já tenha registrado duas matriculas,
        if (preMatriculas.length === 2) {
          return {};
        }
        // Buscar pre cadastros previamente realizados
        const turmaPreMatriculas = PreMatriculaService.criarMapaPreMatricula(preMatriculas);
        const preMatriculasIds = preMatriculas.map(preMatricula => preMatricula.id_disciplina);

        return DesciplinaService.buscarEmCurso(aluno.id_aluno, idDisciplina).then((periodo) => {
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
                preMatriculasIds.indexOf(disciplina.id_disciplina) === -1 &&
                disciplina.total_vagas_do_curso > disciplina.vagas_do_curso &&
                idadeAluno >= disciplina.idade_minima)
              .map(({ disciplina }) => (
                {
                  ...disciplina.dataValues,
                  status: STATUS.VAGA_NO_CURSO,
                  turmas: PreMatriculaService.buscarTurmasValidos(turmaPreMatriculas),
                  nome: disciplina.nome_disciplina,
                  veterano: true,
                }
              ));
            const disciplinasComFilasDeEspera = turma.disciplina.proximas_disciplinas
              .filter(({ disciplina }) =>
                disciplinasComVagasNoCurso.filter(disciplinaComVagasNoCurso =>
                  disciplina.id_disciplina === disciplinaComVagasNoCurso.id_disciplina,
                ).length === 0 &&
                preMatriculasIds.indexOf(disciplina.id_disciplina) === -1 &&
                disciplina.total_fila_de_espera > disciplina.fila_de_espera &&
                idadeAluno >= disciplina.idade_minima,
              )
              .map(({ disciplina }) => (
                {
                  ...disciplina.dataValues,
                  status: STATUS.FILA_DE_ESPERA,
                  turmas: PreMatriculaService.buscarTurmasValidos(turmaPreMatriculas),
                  nome: disciplina.nome_disciplina,
                  veterano: true,
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
              turmas: ret.turmas,
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
        status: 'Ativo',
      },
    }).then((preMatriculas) => {
      if (!preMatriculas) {
        return [];
      }
      return preMatriculas;
    });
  }
}
