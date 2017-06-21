export default (sequelize, DataTypes) => {
  const Curso = sequelize.define('Curso', {
    id_curso: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
    },
    nome_curso: DataTypes.STRING(45),
    descricao_curso: DataTypes.STRING(300),
    status: DataTypes.INTEGER(11),
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
