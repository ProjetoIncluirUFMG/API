import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';
import Promise from 'bluebird';
import config from '../config';

import BD, { criarOuAtualizar } from '../models';

const bcryptPromise = Promise.promisifyAll(bcrypt);
const Aluno = BD.Aluno;

export default class AlunoService {
  static gerarToken(aluno) {
    const timestamp = new Date().getTime();
    const exp = new Date().getTime() + 300000000000;
    return jwt.encode({ sub: aluno.id_aluno, iat: timestamp, exp }, config.jwt.secret);
  }

  static cadastrar(carga) {
    const aluno = carga;
    aluno.rg = `${aluno.uf_rg}-${aluno.numero_rg}`;
    aluno.cadastro_atualizado = true;
    if (aluno.is_cpf_responsavel === undefined || aluno.is_cpf_responsavel === null) {
      aluno.is_cpf_responsavel = false;
    }
    aluno.status = 10;
    return bcryptPromise.genSaltAsync(10)
    .then(salt => bcryptPromise.hashAsync(aluno.senha, salt, null))
    .then((hash) => {
      aluno.senha = hash;
      criarOuAtualizar(Aluno, aluno, { email: aluno.email });
    });
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
