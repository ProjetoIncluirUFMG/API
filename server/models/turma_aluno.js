export default (sequelize, DataTypes) => {
  const TurmaAluno = sequelize.define('TurmaAluno', {
    id_turma_aluno: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    id_turma: DataTypes.INTEGER(11),
    id_aluno: DataTypes.INTEGER(11),
  }, {
    tableName: 'turma_alunos',
    timestamps: false,
  });
  TurmaAluno.associar = (models) => {
    TurmaAluno.belongsTo(models.Turma, {
      foreignKey: 'id_turma',
      targetKey: 'id_turma',
    });
    TurmaAluno.hasMany(models.Falta, {
      foreignKey: 'id_turma_aluno',
      targetKey: 'id_turma_aluno',
      as: 'faltas',
    });
    TurmaAluno.hasMany(models.Aluno, {
      foreignKey: 'id_aluno',
      targetKey: 'id_aluno',
      as: 'alunos',
    });
  };
  return TurmaAluno;
};
