import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { TimePickerComponent } from './time-picker.component';
import { DatePipe } from '@angular/common';

@Directive({
  selector: '[cisTimePicker]'
})
export class TimePickerDirective {
    @Input() timePicker: TimePickerComponent;
    @Input() inputWrapper: ElementRef;
    @Output() time: EventEmitter<any> = new EventEmitter<any>();

    @HostListener('focus') onFocus() {
        this.timePicker.showDatePicker = true;
        this.input.nativeElement.value = this.datePipe.transform(this.timePicker.fullTime, 'HH:mm');
        this.time.emit(this.timePicker.fullTime);
    }

    @HostListener('focusout') onFocusOut() {
        if (this.input.nativeElement.value !== '') {
            const date = new Date();
            const times = (<string>this.input.nativeElement.value).split(':');
            date.setHours(parseInt(times[0], 10 ));
            date.setMinutes(parseInt(times[1], 10 ));
            this.timePicker.fullTime = date;
        }
    }

    @HostListener('document:click', ['$event']) clickout(event) {
        if ( !this.inputWrapper.nativeElement.contains(event.target)) {
            this.timePicker.showDatePicker = false;
        }
    }
    constructor(private input: ElementRef, private datePipe: DatePipe) {
    }
}
