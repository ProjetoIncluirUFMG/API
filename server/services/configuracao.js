import BD from '../models';

const Configuracao = BD.Configuracao;

export default class ConfiguracaoService {
  static buscar() {
    return Configuracao
      .findOne({})
      .then(configuracao => configuracao)
      .catch(error => error);
  }
}
