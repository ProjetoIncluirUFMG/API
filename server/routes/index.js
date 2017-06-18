import Controllers from '../controllers';

const CursoController = Controllers.cursos;

module.exports = (app) => {
  app.get('/cursos', CursoController.lista);
};
