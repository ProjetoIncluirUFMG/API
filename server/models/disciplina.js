export default (sequelize, DataTypes) => {
  const Disciplina = sequelize.define('Disciplina', {
    id_disciplina: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
    },
    nome_disciplina: DataTypes.STRING(100),
    ementa_disciplina: DataTypes.STRING(300),
    id_curso: DataTypes.INTEGER(11),
    status: DataTypes.INTEGER(11),
  }, {
    tableName: 'disciplina',
    timestamps: false,
  });
  Disciplina.associar = (models) => {
    Disciplina.belongsTo(models.Curso, {
      foreignKey: 'id_curso',
      targetKey: 'id_curso',
    });
  };
  return Disciplina;
};
