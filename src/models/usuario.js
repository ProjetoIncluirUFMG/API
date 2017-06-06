import {
  busca
} from '../db';

export default class Usuario {
  constructor({
    id,
    nome,
    sexo,
    cpf,
    cpf_responsavel,
    rg,
    telefone,
    celular,
    data_nascimento,
    email,
    endereco,
    numero,
    complemento,
    bairro,
    cidade,
    cep,
    data_registro,
    status,
    escolaridade,
    estado,
    nome_responsavel
  }) {
    this.id = id;
    this.nome = nome;
    this.sexo = sexo;
    this.cpf = cpf;
    this.cpf_responsavel = cpf_responsavel;
    this.nome_responsavel = nome_responsavel;
    this.rg = rg;
    this.telefone = telefone;
    this.celular = celular;
    this.data_nascimento = data_nascimento;
    this.email = email;
    this.endereco = endereco;
    this.numero = numero;
    this.complemento = complemento;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;
    this.data_registro = data_registro;
    this.status = status;
    this.escolaridade = escolaridade;
  }

  static buscarPorEmail(email) {
    const opcoes = {
      sql: 'SELECT *' +
        ' FROM aluno' +
        ` WHERE aluno.email LIKE '%${email}%'`
    };
    return busca(opcoes).then((resultado) => {
			let usuario = null;
			if (resultado && resultado.length > 0) {
				const aluno = resultado[0];
				usuario = new Usuario({
					id: aluno.id_aluno,
					nome: aluno.nome_aluno,
					sexo: aluno.sexo,
					cpf: aluno.cpf,
					cpf_responsavel: aluno.is_cpf_responsavel,
					nome_responsavel: aluno.nome_responsavel,
					rg: aluno.rg,
					telefone: aluno.telefone,
					celular: aluno.celular,
					data_nascimento: aluno.data_nascimento,
					email: aluno.email,
					endereco: aluno.endereco,
					numero: aluno.numero,
					complemento: aluno.complemento,
					bairro: aluno.bairro,
					cidade: aluno.cidade,
					cep: aluno.cep,
					status: aluno.status,
					escolaridade: aluno.escolaridade,
					estado: aluno.estado
				});
			}

      return usuario;
    });
  }
}
