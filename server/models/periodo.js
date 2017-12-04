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

    Periodo.hasMany(models.DataFuncionamento, {
      foreignKey: 'id_periodo',
      sourceKey: 'id_periodo',
      as: 'data_funcionamentos',
    });
  };
  return Periodo;
};
