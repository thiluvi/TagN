import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador customizado para a lógica (dígitos verificadores) do CPF.
 */
export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    
    const cpf = control.value as string;

    // Se o campo estiver vazio, não validamos (required)
    if (!cpf) {
      return null;
    }

    // Remove caracteres não numéricos
    const cpfNumerico = cpf.replace(/\D/g, '');

    // Se não tiver 11 dígitos, não validamos (minLength/maxLength)
    if (cpfNumerico.length !== 11) {
      return null; 
    }

    // Verifica sequências inválidas (ex: "111.111.111-11")
    const invalidos = [
      '00000000000', '11111111111', '22222222222', '33333333333',
      '44444444444', '55555555555', '66666666666', '77777777777',
      '88888888888', '99999999999'
    ];
    
    if (invalidos.includes(cpfNumerico)) {
      // Retorna um erro específico se for uma sequência inválida
      return { cpfInvalido: true }; 
    }

    // --- Cálculo do 1º Dígito Verificador ---
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = (resto === 10 || resto === 11) ? 0 : resto;

    if (digitoVerificador1 !== parseInt(cpfNumerico.charAt(9))) {
      return { cpfInvalido: true };
    }

    // --- Cálculo do 2º Dígito Verificador ---
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfNumerico.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = (resto === 10 || resto === 11) ? 0 : resto;

    if (digitoVerificador2 !== parseInt(cpfNumerico.charAt(10))) {
      return { cpfInvalido: true };
    }

    // Se passou por todas as verificações, o CPF é válido!
    return null;
  };
}