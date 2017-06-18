const MYSQL_BANCO = process.env.MYSQL_BANCO;
const MYSQL_USUARIO = process.env.MYSQL_USUARIO;
const MYSQL_SENHA = process.env.MYSQL_SENHA;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORTA = process.env.MYSQL_PORTA;

const JWT_SEGREDO = process.env.JWT_SEGREDO;

export default {
  bd: {
    usuario: MYSQL_USUARIO,
    senha: MYSQL_SENHA,
    banco: MYSQL_BANCO,
    host: MYSQL_HOST,
    porta: MYSQL_PORTA,
    dialeto: 'mysql',
  },
  jwt: {
    segredo: JWT_SEGREDO,
  },
};
