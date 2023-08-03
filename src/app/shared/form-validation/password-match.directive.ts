import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * When a user registers or resets a password they must also provide a matching confirmation
 * password.
 */
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMatchFailed: true }
    : null;
};
