import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';
import config from '../config';

import BD from '../models';

const Aluno = BD.Aluno;

export default class AlunoService {
  static gerarToken(aluno) {
    const timestamp = new Date().getTime();
    const exp = new Date().getTime() + 300000000000;
    return jwt.encode({ sub: aluno.id_aluno, iat: timestamp, exp }, config.jwt.secret);
  }

  static buscarPorEmail(email) {
    return Aluno
      .findOne({
        where: {
          email: {
            $like: `%${email}`,
          },
        },
      })
      .then(aluno => aluno)
      .catch(error => error);
  }

  static buscarPorId(id) {
    return Aluno
      .findById(id)
      .then(aluno => aluno)
      .catch(error => error);
  }

  static compararSenhas(senhaAtual, senhaCandidata, callback) {
    bcrypt.compare(senhaCandidata, senhaAtual, (erro, iguais) => {
      if (erro) return callback(erro);
      return callback(null, iguais);
    });
  }
}
