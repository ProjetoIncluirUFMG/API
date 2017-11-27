export default (sequelize, DataTypes) => {
  const DisciplinaPreRequisito = sequelize.define('DisciplinaPreRequisito', {
    id_disciplina: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    id_disciplina_pre_requisito: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
  }, {
    tableName: 'disciplina_pre_requisitos',
    timestamps: false,
  });
  return DisciplinaPreRequisito;
};
