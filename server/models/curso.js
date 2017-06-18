export default (sequelize, DataTypes) => {
  const Curso = sequelize.define('Curso', {
    id_curso: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    nome_curso: DataTypes.STRING,
    descricao_curso: DataTypes.STRING,
    status: DataTypes.INTEGER,
  }, {
    tableName: 'curso',
    timestamps: false,
  });
  Curso.associar = (models) => {
    Curso.hasMany(models.Disciplina, {
      foreignKey: 'id_curso',
      sourceKey: 'id_curso',
      as: 'disciplinas',
    });
  };
  return Curso;
};
