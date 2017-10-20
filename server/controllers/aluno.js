import AlunoService from '../services/aluno';

export default {
  buscar(req, res) {
    return AlunoService.buscarTodosPorCPF(req.query.cpf)
      .then(usuarios => res.status(200).send(usuarios))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  cadastrar(req, res) {
    AlunoService.cadastrar(req.body)
      .then(usuario => res.status(200).send(usuario))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  recuperarSenha(req, res) {
    AlunoService.recuperarSenha(req.body.id_aluno)
      .then(() => res.status(200).send({ emailEnviado: true }))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  resetarSenha(req, res) {
    AlunoService.resetarSenha(req.body.token, req.body.senha, req.body.confirmarSenha)
      .then(() => res.status(200).send({ senhaResetada: true }))
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },

  temDependente(req, res) {
    return AlunoService.temDependente(req.query.cpf)
      .then(({ temDependente, listaDeAlunos }) => {
        res.status(200).send({ temDependente, listaDeAlunos });
      })
      .catch(erro => res.status(400).send({ erro: erro.message }));
  },
};
