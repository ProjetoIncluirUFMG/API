export default (sequelize, DataTypes) => {
  const Falta = sequelize.define('Falta', {
    id_falta: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    id_turma_aluno: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    data_funcionamento: DataTypes.DATE,
  }, {
    tableName: 'falta',
    timestamps: false,
  });
  Falta.associar = (models) => {
    Falta.belongsTo(models.TurmaAluno, {
      foreignKey: 'id_turma_aluno',
      targetKey: 'id_turma_aluno',
    });
  };
  return Falta;
};
