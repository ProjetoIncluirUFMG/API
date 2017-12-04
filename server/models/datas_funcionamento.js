export default (sequelize, DataTypes) => {
  const DataFuncionamento = sequelize.define('DataFuncionamento', {
    data_funcionamento: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    id_periodo: DataTypes.INTEGER(11),
  }, {
    tableName: 'datas_funcionamento',
    timestamps: false,
  });
  DataFuncionamento.associar = (models) => {
    DataFuncionamento.belongsTo(models.Periodo, {
      foreignKey: 'id_periodo',
      targetKey: 'id_periodo',
      as: 'periodo',
    });
  };
  return DataFuncionamento;
};
