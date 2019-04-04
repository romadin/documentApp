import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '../../../../shared/packages/agenda-package/event.model';
import { User } from '../../../../shared/packages/user-package/user.model';
import { EventService } from '../../../../shared/packages/agenda-package/event.service';
import { ToastService } from '../../../../shared/toast.service';
import { LoadingService } from '../../../../shared/loading.service';

@Component({
  selector: 'cim-event-row',
  templateUrl: './event-row.component.html',
  styleUrls: ['./event-row.component.css']
})
export class EventRowComponent implements OnInit {
    @Input() event: Event;
    @Input() currentUser: User;
    @Output() eventToShow: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() eventToDelete: EventEmitter<Event> = new EventEmitter<Event>();

    constructor(private eventService: EventService,
                private toast: ToastService,
                private loading: LoadingService,
                ) { }

    ngOnInit() {
    }

    showEvent(e: MouseEvent): void {
        e.stopPropagation();
        this.eventToShow.emit(this.event);
    }

    deleteEvent(e: MouseEvent): void {
        e.stopPropagation();
        this.loading.isLoading.next(true);
        this.eventService.deleteEvent(this.event).subscribe(() => {
            this.loading.isLoading.next(false);
            this.toast.showSuccess('Activiteit: ' + this.event.name + ' is verwijderd', 'Verwijderd');
            this.eventToDelete.emit(this.event);
        });
    }
}
