export default (sequelize, DataTypes) => {
  const PreMatricula = sequelize.define('PreMatricula', {
    numero_comprovante: {
      primaryKey: true,
      type: DataTypes.INTEGER(10),
    },
    turma: DataTypes.STRING(100),
    status: DataTypes.STRING(45),
    data_modificado: DataTypes.DATE,
    cpf_aluno: DataTypes.STRING(15),
    nome_disciplina: DataTypes.STRING(100),
    id_disciplina: DataTypes.INTEGER(11),
    veterano: DataTypes.BOOLEAN,
    vaga_garantida: DataTypes.BOOLEAN,
    fila_de_nivelamento: DataTypes.BOOLEAN,
    fila_de_espera: DataTypes.BOOLEAN,
    nome_aluno: DataTypes.STRING(100),
    id_aluno: DataTypes.INTEGER(11),
  }, {
    tableName: 'pre_matricula',
    timestamps: false,
  });
  return PreMatricula;
};
