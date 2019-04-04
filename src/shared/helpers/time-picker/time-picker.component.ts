import { Component, Input, OnInit } from '@angular/core';

type TimeType = 'Hours' | 'Minutes';

@Component({
  selector: 'cim-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit {
    @Input() time: Date | string;
    showDatePicker = false;
    fullTime: Date;
    date: Date;

    constructor() {
    }

    @Input()
    set startTime(time: string) {
        const startDate = new Date();
        if (time && time !== '' ) {
            const times = time.split(':');
            startDate.setHours(parseInt(times[0], 10 ));
            startDate.setMinutes(parseInt(times[1], 10 ) + 5);
        }
        this.fullTime = startDate;
    }

    ngOnInit() {
        this.fullTime = this.time instanceof Date ? this.time : new Date();
    }

    increment(event: Event, newValue: number, type: TimeType) {
        event.preventDefault();
        if (type === 'Hours') {
            this.fullTime = new Date((+(this.fullTime.getHours() + (newValue - 1)) * (60000 * 60)) + (+this.fullTime.getMinutes() * 60000));
        } else {
            this.fullTime = new Date((+(this.fullTime.getHours() + -1) * (60000 * 60)) +
                ((+this.fullTime.getMinutes() + newValue) * 60000));
        }
    }
    decrease(event: Event, newValue: number, type: TimeType) {
        event.preventDefault();
        if (type === 'Hours') {
            this.fullTime = new Date((+(this.fullTime.getHours() - (newValue + 1)) * (60000 * 60)) + (+this.fullTime.getMinutes() * 60000));
        } else {
            this.fullTime = new Date(((+this.fullTime.getHours() - 1) * (60000 * 60)) +
                ((+this.fullTime.getMinutes() - newValue) * 60000));
        }
    }
}
