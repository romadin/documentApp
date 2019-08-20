import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '../../../../../shared/packages/agenda-package/event.model';
import { User } from '../../../../../shared/packages/user-package/user.model';
import { EventService } from '../../../../../shared/packages/agenda-package/event.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { startDateBiggerThenEndDate, startTimeBiggerThenEndTime } from '../../../../../shared/form-validator/custom-validators';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EventCommunicationService } from '../../../../../shared/service/communication/event.communication.service';
import { ToastService } from '../../../../../shared/toast.service';

@Component({
  selector: 'cim-event-detail-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements AfterViewInit {
    @Input() user: User;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    eventForm: FormGroup = new FormGroup({
        name: new FormControl(''),
        description: new FormControl(''),
        startDate: new FormControl(''),
        startTime: new FormControl(''),
        endDate: new FormControl(''),
        endTime: new FormControl(''),
        streetName: new FormControl(''),
        residence: new FormControl(''),
    });
    private _event: Event;
    private formHasChanged = false;
    readonly projectId: number;

    constructor(
        private eventCommunication: EventCommunicationService,
        private eventService: EventService,
        private datePipe: DatePipe,
        private router: Router,
        private toast: ToastService,
    ) {
        this.projectId = parseInt(this.router.url.split('/')[2], 10);
    }
    @Input()
    set event(event: Event | undefined) {
        this._event = event;
        if (event instanceof Event) {
            this.setFormValue();
        } else {
            this.resetForm();
        }
    }
    get event(): Event {
        return this._event;
    }

    ngAfterViewInit() {
        this.onFormChanges();
    }
    onSubmit(e: KeyboardEvent) {
        if (this.eventForm.valid && this.formHasChanged) {
            this.updateOrMakeEvent();
            if (this.event.id) {
                this.eventService.editEvent(this.event).subscribe(() => {});
                this.toast.showSuccess('Activiteit: ' + this.event.name + ' is gewijziged', 'Wijzigen');
            } else {
                this.eventService.createEvent(this.event).subscribe(event => {
                    this.toast.showSuccess('Activiteit: ' + event.name + ' toegevoegd', 'Toegevoegd');
                    this.event = event;
                    this.eventCommunication.eventAdded.next(event);
                });
            }
        }
    }
    onCloseView(e: MouseEvent) {
        e.preventDefault();
        this.resetForm();
        this.closeView.emit(true);
    }
    setStartTime(startTime: string): void {
        const startDate = this.getFullDateTime(new Date(startTime), this.eventForm.controls.startDate);
        this.eventForm.controls.startTime.setValue(this.datePipe.transform(startDate, 'HH:mm'));
        this.eventForm.controls.endTime.setValue(this.datePipe.transform(startDate.setMinutes(startDate.getMinutes() + 5), 'HH:mm'));
    }

    setEndTime(endTime: string): void {
        const endDate = this.getFullDateTime(new Date(endTime), this.eventForm.controls.endDate);
        const startDateString = this.createDateFromStringTime(this.eventForm.controls.startTime.value);
        const startDate = this.getFullDateTime(new Date(startDateString), this.eventForm.controls.startDate);
        this.eventForm.controls.endTime.setValue(this.datePipe.transform(endDate, 'HH:mm'));

        if (Date.parse(startDate) >= Date.parse(endDate)) {
            this.toast.showError('Eind tijd mag niet eerder dan de start tijd');
            this.eventForm.controls.endTime.setValue(this.datePipe.transform(startDate.setMinutes(startDate.getMinutes() + 5), 'HH:mm'));
        }
    }
    startDateChange(): void {
        this.eventForm.controls.endDate.setValue(this.eventForm.controls.startDate.value);
    }
    endDateChange(): void {
        if (Date.parse(this.eventForm.controls.startDate.value) > Date.parse(this.eventForm.controls.endDate.value)) {
            this.toast.showError('Eind datum mag niet eerder dan de start datum');
            this.eventForm.controls.endDate.setValue(this.eventForm.controls.startDate.value);
        }
    }
    /**
     * Create date object from string time format is 00:00.
     */
    createDateFromStringTime(time: string): Date {
        const date = new Date();
        const times = time.split(':');
        date.setHours(parseInt(times[0], 10 ));
        date.setMinutes(parseInt(times[1], 10 ));
        return date;
    }
    private setFormValue(): void {
        this.eventForm.controls.name.setValue(this.event.name);
        this.eventForm.controls.description.setValue(this.event.description);
        this.eventForm.controls.startDate.setValue(this.event.startDate);
        this.eventForm.controls.startTime.setValue(this.datePipe.transform(this.event.startDate, 'HH:mm'));
        this.eventForm.controls.endDate.setValue(this.event.endDate);
        this.eventForm.controls.endTime.setValue(this.datePipe.transform(this.event.endDate, 'HH:mm'));
        if (this.event.location) {
            this.eventForm.controls.streetName.setValue(this.event.location.streetName);
            this.eventForm.controls.residence.setValue(this.event.location.residence);
        }
    }

    private setFormValueOfToday(): void {
        const now = new Date();
        this.eventForm.controls.startDate.setValue(now);
        this.eventForm.controls.startTime.setValue(this.datePipe.transform(now, 'HH:mm'));
        this.eventForm.controls.endDate.setValue(now);
        this.eventForm.controls.endTime.setValue(this.datePipe.transform(now.setMinutes(now.getMinutes() + 5), 'HH:mm'));
    }

    private updateOrMakeEvent(): void {
        let event: Event;
        if (this.event) {
            event = this.event;
        } else {
            event = new Event();
            event.location = { streetName: '', residence: '' };
        }

        event.name = this.eventForm.controls.name.value;
        event.description = this.eventForm.controls.description.value;
        event.location.streetName = this.eventForm.controls.streetName.value;
        event.location.residence = this.eventForm.controls.residence.value;

        event.startDate = this.getFullDateTime(
            this.createDateFromStringTime(this.eventForm.controls.startTime.value),
            this.eventForm.controls.startDate
        );
        event.endDate = this.getFullDateTime(
            this.createDateFromStringTime(this.eventForm.controls.endTime.value),
            this.eventForm.controls.startDate
        );
        event.projectId = this.projectId;
        this.event = event;
    }

    private onFormChanges() {
        let oldValue = this.eventForm.value;
        this.eventForm.valueChanges.subscribe(value => {
            for (const key in value) {
                if (value.hasOwnProperty(key) && oldValue.hasOwnProperty(key)) {
                    if (value[key] !== oldValue[key]) {
                        this.formHasChanged = true;
                        oldValue = value;
                        break;
                    }
                    this.formHasChanged = false;
                }
            }
        });
    }

    private getFullDateTime(time: Date, controlToLink: AbstractControl): any {
        if (controlToLink.valid) {
            const pickedDate = new Date(controlToLink.value);
            time.setMonth(pickedDate.getMonth());
            time.setFullYear(pickedDate.getFullYear());
            time.setDate(pickedDate.getDate());
        }
        return time;
    }

    private resetForm() {
        this.eventForm.reset();
        this.setFormValueOfToday();
    }
}
