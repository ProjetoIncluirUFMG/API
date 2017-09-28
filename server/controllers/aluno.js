import AlunoService from '../services/aluno';

export default {
  buscar(req, res) {
    return AlunoService
      .buscarPorCPF(req.query.cpf)
      .then(usuario => res.status(200).send(usuario))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  cadastrar(req, res) {
    AlunoService.cadastrar(req.body)
      .then(usuario => res.status(200).send(usuario))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  recuperarSenha(req, res) {
    AlunoService.recuperarSenha(req.body.cpf)
      .then(() => res.status(200).send({ emailEnviado: true }))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  resetarSenha(req, res) {
    AlunoService.resetarSenha(req.body.token, req.body.senha, req.body.confirmarSenha)
      .then(() => res.status(200).send({ senhaResetada: true }))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  temDependente(req, res) {
    AlunoService.temDependente(req.query.cpf)
      .then(({ temDependente, listaDependentes }) =>
        res.status(200).send({ temDependente, listaDependentes }),
      )
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },
};
