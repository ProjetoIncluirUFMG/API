import ConfiguracaoService from '../services/configuracao';

export default {
  buscar(req, res) {
    return ConfiguracaoService
      .buscar()
      .then(configuracao => res.status(200).send(configuracao))
      .catch(error => res.status(400).send(error));
  },
};
