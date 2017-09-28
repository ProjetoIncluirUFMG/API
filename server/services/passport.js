import passport from 'passport';
import passportJwt from 'passport-jwt';
import LocalStategy from 'passport-local';

import config from '../config';
import AlunoService from './aluno';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const opcoesLocais = {
  usernameField: 'cpf',
  passwordField: 'senha',
  session: false,
};

const loginLocal = new LocalStategy(opcoesLocais, (cpf, senha, done) => {
  AlunoService.buscarPorCPF(cpf).then((usuario) => {
    if (!usuario) return done(null, false);

    return AlunoService.compararSenhas(usuario.senha, senha, (erro, iguais) => {
      if (erro) return done(erro, false);
      if (!iguais) return done(null, false);
      return done(null, usuario);
    });
  }).catch(erro => done(erro, false));
});


const opcoesJwt = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.jwt.segredo,
};

const loginJwt = new JwtStrategy(opcoesJwt, (carga, done) => {
  AlunoService.buscarPorId(carga.sub).then((usuario) => {
    if (usuario) done(null, usuario);
    done(null, false);
  }).fail(err => done(err, false));
});

passport.use(loginJwt);
passport.use(loginLocal);
