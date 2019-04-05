import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../../../../../shared/packages/agenda-package/event.model';
import { User } from '../../../../../shared/packages/user-package/user.model';
import { EventPostData, EventService } from '../../../../../shared/packages/agenda-package/event.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { startDateBiggerThenEndDate, startTimeBiggerThenEndTime } from '../../../../../shared/form-validator/custom-validators';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { EventCommunicationService } from '../../../../../shared/packages/communication/event.communication.service';
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
        zipCode: new FormControl(''),
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
        this.eventForm.controls.endDate.setValidators(
            startDateBiggerThenEndDate(this.eventForm.controls.startDate, this.eventForm.controls.endDate)
        );
        this.eventForm.controls.startDate.setValidators(
            startDateBiggerThenEndDate(this.eventForm.controls.startDate, this.eventForm.controls.endDate)
        );
        this.eventForm.controls.endTime.setValidators(
            startTimeBiggerThenEndTime(this.eventForm.controls.startTime, this.eventForm.controls.endTime)
        );
        this.eventForm.controls.startTime.setValidators(
            startTimeBiggerThenEndTime(this.eventForm.controls.startTime, this.eventForm.controls.endTime)
        );
    }
    @Input()
    set event(event: Event | undefined) {
        this._event = event;
        if (event instanceof Event) {
            this.setFormValue();
        } else {
            this.eventForm.reset();
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
                this.toast.showSuccess('Activiteit: ' + this.event.name + 'is gewijziged', 'Wijzigen');
            } else {
                this.eventService.createEvent(this.event).subscribe(event => {
                    this.toast.showSuccess('Activiteit: ' + event.name + 'toegevoegd', 'Toegevoegd');
                    this.event = event;
                    this.eventCommunication.eventAdded.next(event);
                });
            }
        }
    }
    onCloseView(e: MouseEvent) {
        e.preventDefault();
        this.closeView.emit(true);
    }
    setStartTime(startTime: string): void {
        const startDate = this.getFullDateTime(new Date(startTime), this.eventForm.controls.startDate);
        this.eventForm.controls.startTime.setValue(this.datePipe.transform(startDate, 'HH:mm'));
    }

    setEndTime(endTime: string): void {
        const endDate = this.getFullDateTime(new Date(endTime), this.eventForm.controls.endDate);
        this.eventForm.controls.endTime.setValue(this.datePipe.transform(endDate, 'HH:mm'));
    }

    private setFormValue(): void {
        this.eventForm.controls.name.setValue(this._event.name);
        this.eventForm.controls.description.setValue(this._event.description);
        this.eventForm.controls.startDate.setValue(this._event.startDate);
        this.eventForm.controls.startTime.setValue(this.datePipe.transform(this._event.startDate, 'HH:mm'));
        this.eventForm.controls.endDate.setValue(this._event.endDate);
        this.eventForm.controls.endTime.setValue(this.datePipe.transform(this._event.endDate, 'HH:mm'));
        if (this.event.location) {
            this.eventForm.controls.streetName.setValue(this._event.location.streetName);
            this.eventForm.controls.zipCode.setValue(this._event.location.zipCode);
            this.eventForm.controls.residence.setValue(this._event.location.residence);
        }
    }

    private updateOrMakeEvent(): void {
        let event: Event;
        if (this.event) {
            event = this._event;
        } else {
            event = new Event();
            event.location = { streetName: '', zipCode: '', residence: '' };
        }

        event.name = this.eventForm.controls.name.value;
        event.description = this.eventForm.controls.description.value;
        event.location.streetName = this.eventForm.controls.streetName.value;
        event.location.zipCode = this.eventForm.controls.zipCode.value;
        event.location.residence = this.eventForm.controls.residence.value;

        event.startDate = this.getFullDateTime(
            new Date(this.createDateFromStringTime(this.eventForm.controls.startTime.value)),
            this.eventForm.controls.startDate
        );
        event.endDate = this.getFullDateTime(
            new Date(this.createDateFromStringTime(this.eventForm.controls.endTime.value)),
            this.eventForm.controls.startDate
        );
        event.projectId = this.projectId;
        this._event = event;
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

    /**
     * Create date object from string time format is 00:00.
     */
    private createDateFromStringTime(time: string): string {
        const date = new Date();
        const times = time.split(':');
        date.setHours(parseInt(times[0], 10 ));
        date.setMinutes(parseInt(times[1], 10 ));
        return date.toLocaleString();
    }
}
