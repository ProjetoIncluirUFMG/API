export default (sequelize, DataTypes) => {
  const Disciplina = sequelize.define('Disciplina', {
    id_disciplina: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    nome_disciplina: DataTypes.STRING,
    ementa_disciplina: DataTypes.STRING,
    id_curso: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
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
