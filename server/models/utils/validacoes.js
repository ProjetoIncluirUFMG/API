export function CPFValido(CPF) {
  const strCPF = CPF.replace(/\./g, '').replace(/-/g, '');

  let Soma;
  let Resto;
  Soma = 0;

  if (strCPF === '' || strCPF === undefined || strCPF === null) return false;

  if (strCPF === '00000000000') return false;

  for (let i = 1; i <= 9; i += 1) Soma += parseInt(strCPF.substring(i - 1, i), 10) * (11 - i);

  Resto = (Soma * 10) % 11;

  if ((Resto === 10) || (Resto === 11)) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(9, 10), 10)) return false;

  Soma = 0;
  for (let i = 1; i <= 10; i += 1) Soma += parseInt(strCPF.substring(i - 1, i), 10) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto === 10) || (Resto === 11)) Resto = 0;
  if (Resto !== parseInt(strCPF.substring(10, 11), 10)) return false;
  return true;
}

export default {
  CPFValido,
};
