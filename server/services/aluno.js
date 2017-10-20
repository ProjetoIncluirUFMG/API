import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';
import Promise from 'bluebird';
import es6Request from 'es6-request';
import crypto from 'crypto';

import EmailService from './email';
import config from '../config';

import BD, { criar, atualizar, criarOuAtualizar } from '../models';

const bcryptPromise = Promise.promisifyAll(bcrypt);
const Aluno = BD.Aluno;

export default class AlunoService {
  static gerarToken(aluno) {
    const timestamp = new Date().getTime();
    const exp = new Date().getTime() + 300000000000;
    return jwt.encode({
      sub: aluno.id_aluno,
      iat: timestamp,
      exp,
    }, config.jwt.segredo);
  }

  static cadastrar(carga) {
    let cargaTradada = null;

    let buscarPorId = false;
    let buscarPorCPF = false;
    let promise = null;

    if (carga.id_aluno) {
      buscarPorId = true;
      promise = this.buscarPorId(carga.id_aluno);
    } else if (carga.cpf) {
      buscarPorCPF = true;
      promise = this.buscarUmPorCPFENaoDependente(carga.cpf);
    } else {
      throw new Error('Favor fornecer um numero de id, ou cpf válido!');
    }

    return promise.then((alunoEncontrado) => {
      // Usuário dependente já cadastrado e atualizado
      if (alunoEncontrado !== '' && alunoEncontrado !== null &&
          buscarPorId && alunoEncontrado.cadastro_atualizado) {
        throw new Error('Seu cadastro já encontra-se atualizado. Clique em "Login" para entrar no sistema');
      }

      // Usuário não dependente já cadastrado e atualizado
      if (alunoEncontrado !== '' && alunoEncontrado !== null &&
          buscarPorCPF && !carga.is_cpf_responsavel) {
        throw new Error('Seu cadastro já encontra-se atualizado. Clique em "Login" para entrar no sistema');
      }

      // Validar senha
      if (carga.senha !== carga.confirmarSenha) {
        throw new Error('Senha incorreta! Digite ambos valores novamente');
      }

      cargaTradada = carga;
      // Remover qualquer id entrgue pelo front-end caso aluno não encontrado no banco de dados
      if ((alunoEncontrado === '' || alunoEncontrado === null) ||
          (buscarPorCPF && alunoEncontrado && cargaTradada.is_cpf_responsavel)) {
        delete cargaTradada.id_aluno;
      }

      // Caso novo aluno, setar data de registro como data atual
      if (!alunoEncontrado.data_registro) {
        cargaTradada.data_registro = new Date();
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

      const aluno = cargaTradada;

      if (aluno.uf_rg && aluno.uf_rg.length > 0 && aluno.numero_rg && aluno.numero_rg.length > 0) {
        aluno.rg = `${aluno.uf_rg}-${aluno.numero_rg}`;
      }

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
          if (aluno.id_aluno) {
            return atualizar(Aluno, aluno, { id_aluno: aluno.id_aluno });
          }
          return criar(Aluno, aluno);
        });
    })
      .then(aluno => ({ aluno, jwt: AlunoService.gerarToken(aluno) }))
      .catch((erro) => {
        throw new Error(erro);
      });
  }

  static temDependente(cpf) {
    return this.buscarTodosPorCPF(cpf)
      .then((alunos) => {
        let temDependente = false;
        const listaDeAlunos = alunos.map((aluno) => {
          if (aluno.dataValues.is_cpf_responsavel) temDependente = true;
          return {
            id_aluno: aluno.dataValues.id_aluno,
            is_cpf_responsavel: aluno.dataValues.is_cpf_responsavel,
            nome_aluno: aluno.dataValues.nome_aluno,
            email: aluno.dataValues.email,
            rg: aluno.dataValues.rg,
          };
        });

        return {
          temDependente,
          listaDeAlunos,
        };
      });
  }

  static recuperarSenha(idAluno) {
    return AlunoService.buscarPorId(idAluno)
      .then((usuario) => {
        if (usuario === null) throw new Error('Email não encontrado na base de dados!');

        return criarOuAtualizar(Aluno,
          {
            recuperar_senha_token: crypto.randomBytes(32).toString('hex'),
          },
          { id_aluno: idAluno },
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

  static buscarTodosPorCPF(cpf) {
    return Aluno
      .findAll({
        where: {
          cpf: {
            $eq: `${cpf}`,
          },
        },
      })
      .then(alunos => alunos)
      .catch(error => error);
  }

  static buscarUmPorCPFENaoDependente(cpf) {
    return Aluno
      .findOne({
        where: {
          cpf: {
            $eq: `${cpf}`,
          },
          is_cpf_responsavel: {
            $eq: false,
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
