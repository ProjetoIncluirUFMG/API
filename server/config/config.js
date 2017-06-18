const MYSQL_DB = process.env.MYSQL_DB;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_PORT = process.env.MYSQL_PORT;

export default {
  mysql: {
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: 'mysql',
  },
};
