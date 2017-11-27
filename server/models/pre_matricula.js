export default (sequelize, DataTypes) => {
  const PreMatricula = sequelize.define('PreMatricula', {
    numero_comprovante: {
      primaryKey: true,
      type: DataTypes.INTEGER(10),
    },
    aluno_cpf: DataTypes.STRING(15),
    nome_curso: DataTypes.STRING(45),
    id_curso: DataTypes.INTEGER(11),
    nome_disciplina: DataTypes.STRING(100),
    id_disciplina: DataTypes.INTEGER(11),
    nome_turma: DataTypes.STRING(100),
    id_turma: DataTypes.INTEGER(11),
    veterano: DataTypes.BOOLEAN,
    vaga_garantida: DataTypes.BOOLEAN,
    fila_nivelamento: DataTypes.BOOLEAN,
    fila_espera: DataTypes.BOOLEAN,
    nome_aluno: DataTypes.STRING(100),
    id_aluno: DataTypes.INTEGER(11),
  }, {
    tableName: 'pre_matricula',
    timestamps: false,
  });
  return PreMatricula;
};
