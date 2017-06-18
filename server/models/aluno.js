export default (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    id_aluno: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    nome_aluno: DataTypes.STRING,
    sexo: DataTypes.INTEGER,
    cpf: DataTypes.STRING,
    is_cpf_responsavel: DataTypes.BOOLEAN,
    rg: DataTypes.STRING,
    telefone: DataTypes.STRING,
    celular: DataTypes.STRING,
    data_nascimento: DataTypes.DATE,
    email: DataTypes.STRING,
    google_places_json: DataTypes.TEXT,
    endereco_google: DataTypes.STRING,
    cadastro_atualizado: DataTypes.BOOLEAN,
    endereco: DataTypes.STRING,
    numero: DataTypes.INTEGER,
    complemento: DataTypes.STRING,
    bairro: DataTypes.STRING,
    cidade: DataTypes.STRING,
    cep: DataTypes.STRING,
    data_registro: DataTypes.DATE,
    motivo_desligamento: DataTypes.STRING,
    escolaridade: DataTypes.STRING,
    estado: DataTypes.STRING,
    nome_responsavel: DataTypes.STRING,
  }, {
    tableName: 'aluno',
    timestamps: false,
  });
  return Aluno;
};
