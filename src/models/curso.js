import {
  busca
} from '../db';
import Disciplina from './disciplina';

export default class Curso {
  constructor({
    id,
    nome,
    descricao,
    status,
    disciplinas
  }) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.status = status;
    this.disciplinas = disciplinas;
  }

  static buscarTodos() {
    const opcoes = {
      sql: 'SELECT curso.*, disciplina.*,' +
        ' disciplina.status AS disciplina_status' +
        ' FROM curso AS curso' +
        ' LEFT JOIN disciplina AS disciplina ON curso.id_curso = disciplina.id_curso' +
        ' WHERE curso.status=1 AND disciplina.status=1' +
        ' ORDER BY curso.id_curso, disciplina.nome_disciplina'
    };
    return busca(opcoes).then((resultado) => {
      let cursos = {};

      resultado.forEach((curso) => {
        if (!cursos[curso.id_curso]) {
          cursos[curso.id_curso] = new Curso({
            id: curso.id_curso,
            nome: curso.nome_curso,
            descricao: curso.descricao_curso,
            status: curso.status,
            disciplinas: []
          });
        }

        cursos[curso.id_curso].disciplinas.push(new Disciplina({
          id: curso.id_disciplina,
          nome: curso.nome_disciplina,
          ementa: curso.ementa_disciplina,
          id_curso: curso.id_curso,
          status: curso.disciplina_status
        }));

      });

			return cursos;
    });
  }

}
