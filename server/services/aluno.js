import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';
import Promise from 'bluebird';
import es6Request from 'es6-request';
import crypto from 'crypto';

import EmailService from './email';
import config from '../config';

import BD, { criarOuAtualizar } from '../models';

const bcryptPromise = Promise.promisifyAll(bcrypt);
const Aluno = BD.Aluno;

export default class AlunoService {
  static gerarToken(aluno) {
    const timestamp = new Date().getTime();
    const exp = new Date().getTime() + 300000000000;
    return jwt.encode({ sub: aluno.id_aluno, iat: timestamp, exp }, config.jwt.segredo);
  }

  static cadastrar(carga) {
    // Validar se usuario já foi cadastrador
    return this.buscarPorEmail(carga.email).then((alunoEncontrado) => {
      if (alunoEncontrado !== '' && alunoEncontrado !== null && alunoEncontrado.cadastro_atualizado === true) {
        throw new Error('Você já está cadastrado. Clique em "Login" para entrar no sistema');
      }

      // Validar senha
      if (carga.senha !== carga.confirmarSenha) {
        throw new Error('Senha incorreta! Digite ambos valores novamente');
      }

      // Validações do re-captcha
      const form = {
        secret: process.env.RE_CAPTCHA_SECRET,
        response: carga.captcha,
      };

      return es6Request.post(process.env.RE_CAPTCHA_URL).sendForm(form);
    }).then(([corpo]) => {
      const corpoJSON = JSON.parse(corpo);
      if (corpoJSON.success !== true) {
        throw new Error('Captcha inválido, recarregue a página e tente novamente.');
      }

      const aluno = carga;
      aluno.rg = `${aluno.uf_rg}-${aluno.numero_rg}`;
      aluno.cadastro_atualizado = true;
      if (aluno.is_cpf_responsavel === undefined || aluno.is_cpf_responsavel === null) {
        aluno.is_cpf_responsavel = false;
      }
      aluno.status = 10; // Ativo
      return bcryptPromise.genSaltAsync(10)
        .then(salt => bcryptPromise.hashAsync(aluno.senha, salt, null))
        .then((hash) => {
          aluno.senha = hash;
          const dataNascimento = aluno.data_nascimento.split('-');
          aluno.data_nascimento =
          new Date(dataNascimento[2], dataNascimento[1] - 1, dataNascimento[0]);
          return criarOuAtualizar(Aluno, aluno, { email: aluno.email });
        });
    }).then(aluno => ({ aluno, jwt: AlunoService.gerarToken(aluno) }))
      .catch((erro) => {
        throw new Error(erro);
      });
  }

  static recuperarSenha(email) {
    return Aluno
      .findOne({
        where: {
          email: {
            $like: `%${email}`,
          },
        },
      })
      .then((usuario) => {
        if (usuario === null) throw new Error('Email não encontrado na base de dados!');

        return criarOuAtualizar(Aluno,
          {
            recuperar_senha_token: crypto.randomBytes(32).toString('hex'),
          },
          { email },
        );
      })
      .then((usuario) => {
        EmailService.enviar(usuario.email, 'Projeto Incluir - Reset Senha',
          `<a href="${process.env.PROJETO_INCLUIR_HOST}/resetarSenha/${usuario.recuperar_senha_token}">Clique aqui para resetar sua senha</a>`);
      }).catch((erro) => {
        throw new Error(erro);
      });
  }

  static resetarSenha(token, novaSenha, confirmarNovaSenha) {
    // Validar senha
    if (novaSenha !== confirmarNovaSenha) {
      throw new Error('Senha incorreta! Digite ambos valores novamente');
    }

    return bcryptPromise.genSaltAsync(10)
      .then(salt => bcryptPromise.hashAsync(novaSenha, salt, null))
      .then(hash => criarOuAtualizar(Aluno,
        {
          senha: hash,
        },
        { recuperar_senha_token: token },
      )).then((alunoEncontrado) => {
        if (alunoEncontrado === null && alunoEncontrado === undefined) {
          throw new Error('Token inválido! Tente o processo de recuperação de senha novamente');
        }
      })
      .catch((erro) => {
        throw new Error(erro);
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
