export default (sequelize, DataTypes) => {
  const Configuracao = sequelize.define('Configuracao', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    texto_inicial: DataTypes.STRING(10000),
    somente_veterano: DataTypes.BOOLEAN,
  }, {
    tableName: 'configuracao_cadastro',
    timestamps: false,
  });
  return Configuracao;
};
