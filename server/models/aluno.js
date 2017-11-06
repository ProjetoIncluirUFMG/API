import { CPFValido } from './utils/validacoes';

export default (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    id_aluno: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
    },
    nome_aluno: {
      type: DataTypes.STRING(100),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Nome do aluno não pode estar vazio.',
        },
      },
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING(45),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Senha não pode estar vazio.',
        },
      },
      allowNull: false,
    },
    sexo: {
      type: DataTypes.INTEGER(1),
      validate: {
        isInt: {
          args: true,
          msg: 'Sexo deve ser um valor numéro.',
        },
        notEmpty: {
          args: true,
          msg: 'Sexo não pode estar vazio.',
        },
      },
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(15),
      validate: {
        isCPF(cpf) {
          if (!CPFValido(cpf)) {
            throw new Error('CPF inválido!');
          }
        },
        notEmpty: {
          args: true,
          msg: 'CPF não pode estar vazio.',
        },
      },
      allowNull: false,
    },
    is_cpf_responsavel: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Check do CPF do responsavel não pode estar vazio.',
        },
      },
      allowNull: false,
    },
    rg: DataTypes.STRING(20),
    telefone: {
      type: DataTypes.STRING(20),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Telefone não pode estar vazio.',
        },
        len: {
          args: [14, 14],
          msg: 'Telefone deve conter 10 caracteres.',
        },
      },
      allowNull: false,
    },
    celular: {
      type: DataTypes.STRING(20),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Celular não pode estar vazio.',
        },
        len: {
          args: [15, 15],
          msg: 'Telefone deve conter 11 caracteres.',
        },
      },
      allowNull: false,
    },
    data_nascimento: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Data de nascimento não pode estar vazio.',
        },
        isDate: {
          args: true,
          msg: 'Data de nascimento não é uma data.',
        },
      },
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email não pode estar vazio.',
        },
        isEmail: {
          args: true,
          msg: 'Email não inválido.',
        },
      },
      allowNull: false,
    },
    google_places_json: {
      type: DataTypes.TEXT(10000),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Google places não pode estar vazio.',
        },
      },
      allowNull: false,
    },
    cadastro_atualizado: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Cadastro atualizado não pode estar vazio.',
        },
      },
      allowNull: false,
    },
    recuperar_senha_token: DataTypes.STRING(255),
    endereco: DataTypes.STRING(150),
    numero: DataTypes.INTEGER(10),
    complemento: DataTypes.STRING(50),
    bairro: DataTypes.STRING(150),
    cidade: DataTypes.STRING(100),
    cep: DataTypes.STRING(20),
    data_registro: DataTypes.DATE,
    status: DataTypes.INTEGER(11),
    data_desligamento: DataTypes.DATE,
    motivo_desligamento: DataTypes.STRING(300),
    escolaridade: {
      type: DataTypes.STRING(100),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Escolaridade não pode estar vazio.',
        },
        isIn: {
          args: [['Fundamental Completo', 'Fundamental Incompleto', 'Médio Completo', 'Médio Incompleto', 'Superior Completo', 'Superior Incompleto']],
          msg: 'Escolaridade contem valor inválido.',
        },
      },
      allowNull: false,
    },
    estado: DataTypes.STRING(100),
    nome_responsavel: {
      type: DataTypes.STRING(100),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Nome do responsavel não pode estar vazio.',
        },
      },
      allowNull: true,
    },
  }, {
    tableName: 'aluno',
    timestamps: false,
  });
  return Aluno;
};
