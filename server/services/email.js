import nodemailer from 'nodemailer';
import Promise from 'bluebird';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: process.env.RESETAR_SENHA_EMAIL_REMETENTE,
    pass: process.env.RESETAR_SENHA_SENHA_REMETENTE,
  },
});


export default class EmailService {
  static enviar(destinatario, sujeito, mensagem) {
    const opcoesEmail = {
      from: `"Projeto Incluir" <${process.env.RESETAR_SENHA_EMAIL_REMETENTE}>`,
      to: destinatario,
      subject: sujeito,
      html: mensagem,
    };

    return new Promise((res, rej) => {
      transporter.sendMail(opcoesEmail, (erro, data) => {
        if (erro) rej(erro);
        else res(data);
      });
    });
  }
}
