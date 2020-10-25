import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../shared/packages/agenda-package/event.service';
import { Event } from '../../../shared/packages/agenda-package/event.model';
import { UserService } from '../../../shared/packages/user-package/user.service';
import { User } from '../../../shared/packages/user-package/user.model';
import { HeaderWithFolderCommunicationService } from '../../../shared/service/communication/HeaderWithFolder.communication.service';
import { RouterService } from '../../../shared/service/router.service';
import { MenuAction } from '../../header/header.component';

@Component({
  selector: 'cim-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
    events: Event[];
    rightSideActive = false;
    eventToEdit: Event;
    currentUser: User;

    constructor(
        private eventService: EventService,
        private route: ActivatedRoute,
        private userService: UserService,
        private headerService: HeaderWithFolderCommunicationService,
        private routerService: RouterService
    ) { }

    ngOnInit() {
        this.events = <Event[]>this.route.snapshot.data.events;
        this.headerService.headerTitle.next('Agenda');
        this.routerService.setBackRouteParentFromActivatedRoute(this.route.parent);
        this.userService.getCurrentUser().subscribe((user) => {
            this.currentUser = user;
        });

        const addEvent: MenuAction = {
            onClick: () => {
                this.eventToEdit = undefined;
                this.rightSideActive = true;
            },
            iconName: 'add',
            name: 'Activiteit toevoegen',
            show: false,
            needsAdmin: true,
        };
        this.routerService.setHeaderAction([addEvent]);
    }

    onSaveEvent(event: Event): void {
        this.eventToEdit ? this.onCloseRightSide() : this.events.push(event);
    }

    eventOnClick(clickedEvent: Event): void  {
        this.eventToEdit = clickedEvent;
        this.rightSideActive = true;
    }

    eventOnDelete(eventToDelete: Event): void {
        this.events.splice(this.events.findIndex(event => event === eventToDelete), 1);
        if (eventToDelete === this.eventToEdit ) {
            this.onCloseRightSide();
        }
    }

    onCloseRightSide(): void {
        this.rightSideActive = false;
        this.reset();
    }

    private reset(): void {
        setTimeout(() => {
            this.eventToEdit = undefined;
        }, 500);
    }

}
