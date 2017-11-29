import ConfiguracaoService from '../services/configuracao';

export default {

  // Middleware para validar se sistema foi inativado pelo administrador
  validarSeAPIAtiva(req, res, next) {
    return ConfiguracaoService
      .buscar()
      .then((configuracao) => {
        if (configuracao.sistema_ativo) {
          return next();
        }
        return res.status(400).send({ apiInativa: true });
      })
      .catch(error => res.status(400).send(error));
  },

  buscar(req, res) {
    return ConfiguracaoService
      .buscar()
      .then(configuracao => res.status(200).send(configuracao))
      .catch(error => res.status(400).send(error));
  },
};
