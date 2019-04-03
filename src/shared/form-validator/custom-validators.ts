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

/**
 * If the control value has a duplicate.
 */
export function duplicateValidator(existingItems: string[]): ValidatorFn {
    return (control: AbstractControl) => {
        return existingItems.find(item => item === control.value) ? {'duplicate': {value: control.value}} : null;
    };
}

/**
 * Check if the start date is bigger then the end date by valid date string.
 */
export function startDateBiggerThenEndDate(startDate: AbstractControl, endDate: AbstractControl): ValidatorFn {
    return (control: AbstractControl) => {
        const startDateHigher = Date.parse(startDate.value) > Date.parse(endDate.value);
        return startDateHigher ? {'startDateBiggerThenEndDate': {value: control.value}} : null;
    };
}

/**
 * Check if the start time is bigger by string time format is 00:00.
 */
export function startTimeBiggerThenEndTime(startTime: AbstractControl, endTime: AbstractControl): ValidatorFn {
    return (control: AbstractControl) => {
        let startTimeHigher = false;
        if (startTime.value && startTime.value !== '' && endTime.value && endTime.value !== '') {
            const startDateString = createDateFromStringTime(startTime.value);
            const endDateString = createDateFromStringTime(endTime.value);
            startTimeHigher = Date.parse(startDateString) >= Date.parse(endDateString);
        }
        return startTimeHigher ? {'startTimeHigherOrEqual': {value: control.value}} : null;
    };
}

/**
 * Create date object from string time format is 00:00.
 */
function createDateFromStringTime(time: string): string {
    const date = new Date();
    const times = time.split(':');
    date.setHours(parseInt(times[0], 10 ));
    date.setMinutes(parseInt(times[1], 10 ));
    return date.toLocaleString();
}
