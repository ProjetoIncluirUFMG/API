export default (sequelize, DataTypes) => {
  const Periodo = sequelize.define('Periodo', {
    id_periodo: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    is_atual: DataTypes.BOOLEAN,
  }, {
    tableName: 'periodo',
    timestamps: false,
  });
  Periodo.associar = (models) => {
    Periodo.hasMany(models.Turma, {
      foreignKey: 'id_periodo',
      sourceKey: 'id_periodo',
      as: 'turmas',
    });
  };
  return Periodo;
};
