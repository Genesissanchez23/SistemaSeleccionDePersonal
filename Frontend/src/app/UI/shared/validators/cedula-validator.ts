import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cedulaValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.length !== 10 || isNaN(value)) {
      return { cedulaInvalida: true };
    }

    let total = 0;
    const coeficiente = [2, 1];

    for (let i = 0; i < 9; i++) {
      let digito = parseInt(value[i], 10);
      let valor = digito * coeficiente[i % 2];

      if (valor > 9) {
        valor -= 9;
      }
      total += valor;
    }

    const decenaSuperior = Math.ceil(total / 10) * 10;
    let digitoVerificador = decenaSuperior - total;

    if (digitoVerificador === 10) {
      digitoVerificador = 0;
    }

    if (digitoVerificador !== parseInt(value[9], 10)) {
      return { cedulaInvalida: true };
    }

    return null;
  };
}
