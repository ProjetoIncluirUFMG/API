export default (sequelize, DataTypes) => {
  const Disciplina = sequelize.define('Disciplina', {
    id_disciplina: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
    },
    nome_disciplina: DataTypes.STRING(100),
    ementa_disciplina: DataTypes.STRING(300),

    vagas_do_curso: DataTypes.INTEGER(10),
    fila_de_nivelamento: DataTypes.INTEGER(10),
    fila_de_espera: DataTypes.INTEGER(10),
    total_vagas_do_curso: DataTypes.INTEGER(10),
    total_fila_de_nivelamento: DataTypes.INTEGER(10),
    total_fila_de_espera: DataTypes.INTEGER(10),

    idade_minima: DataTypes.INTEGER(10),
    id_curso: DataTypes.INTEGER(11),
    status: DataTypes.INTEGER(11),
  }, {
    tableName: 'disciplina',
    timestamps: false,
  });
  Disciplina.associar = (models) => {
    Disciplina.hasMany(models.DisciplinaPreRequisito, {
      foreignKey: 'id_disciplina_pre_requisito',
      targetKey: 'id_disciplina',
      as: 'proximas_disciplinas',
    });
    Disciplina.hasMany(models.DisciplinaPreRequisito, {
      foreignKey: 'id_disciplina',
      targetKey: 'id_disciplina',
      as: 'pre_disciplinas',
    });
    Disciplina.belongsTo(models.Curso, {
      foreignKey: 'id_curso',
      targetKey: 'id_curso',
      as: 'curso',
    });
  };
  return Disciplina;
};
