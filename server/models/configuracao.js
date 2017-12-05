export default (sequelize, DataTypes) => {
  const Configuracao = sequelize.define('Configuracao', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    somente_veterano: DataTypes.BOOLEAN,
    sistema_ativo: DataTypes.BOOLEAN,

    texto_inicial: DataTypes.STRING(10000),
    texto_pagina_fila_espera: DataTypes.STRING(10000),
    texto_pagina_fila_nivelamento: DataTypes.STRING(10000),
    texto_pagina_vaga_disponivel: DataTypes.STRING(10000),
    texto_popup_fila_espera: DataTypes.STRING(10000),
    texto_popup_fila_nivelamento: DataTypes.STRING(10000),
    texto_popup_vaga_disponivel: DataTypes.STRING(10000),
  }, {
    tableName: 'configuracao_cadastro',
    timestamps: false,
  });
  return Configuracao;
};
