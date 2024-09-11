import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const allowedDomains = [
    'gmail.com',
    'outlook.com',
    'outlook.es',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'mail.com',
    '.edu',
    '.gov',
    '.org',
    'ug.edu.ec'
  ];

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      return { emailInvalido: true };
    }

    const domain = value.split('@')[1];

    const isValidDomain = allowedDomains.some((allowedDomain) => {
        return domain.endsWith(allowedDomain);
    });

    return isValidDomain ? null : { emailInvalido: true };
    
  };
}
