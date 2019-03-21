import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * If the control(input) value is higher then the amount value show error.
 */
export function weekNumberValidator(amount: number): ValidatorFn {
    return (control: AbstractControl) => {
        const maxNumber = amount < control.value;
        return maxNumber ? {'weekNumber': {value: control.value}} : null;
    };
}

export function duplicateValidator(existingItems: string[]): ValidatorFn {
    return (control: AbstractControl) => {
        return existingItems.find(item => item === control.value) ? {'duplicate': {value: control.value}} : null;
    };
}
