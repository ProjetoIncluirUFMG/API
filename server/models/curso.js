export default (sequelize, DataTypes) => {
  return sequelize.define('Curso', {
    id_curso: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nome_curso: DataTypes.TEXT,
    descricao_curso: DataTypes.TEXT,
    status: DataTypes.INTEGER,
  }, {
    tableName: 'curso',
    timestamps: false,
  });
};
