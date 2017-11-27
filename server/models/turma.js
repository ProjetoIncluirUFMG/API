export default (sequelize, DataTypes) => {
  const Turma = sequelize.define('Turma', {
    id_turma: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    id_periodo: DataTypes.INTEGER(11),
    id_disciplina: DataTypes.INTEGER(11),
  }, {
    tableName: 'turma',
    timestamps: false,
  });
  Turma.associar = (models) => {
    Turma.belongsTo(models.Periodo, {
      foreignKey: 'id_periodo',
      targetKey: 'id_periodo',
    });
    Turma.hasMany(models.TurmaAluno, {
      foreignKey: 'id_turma',
      targetKey: 'id_turma',
      as: 'turma_aluno',
    });
  };
  return Turma;
};
