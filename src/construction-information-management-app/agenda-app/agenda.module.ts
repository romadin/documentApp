import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { DatePipe } from '@angular/common';

import { AgendaComponent } from './agenda/agenda.component';
import { EventRowComponent } from './agenda/event-row/event-row.component';
import { EventDetailComponent } from './agenda/event-detail/event-detail.component';
import { PublicComponent } from './agenda/event-detail/public/public.component';
import { AdminComponent } from './agenda/event-detail/admin/admin.component';
import { TimePickerComponent } from '../../shared/helpers/time-picker/time-picker.component';
import { TimePickerDirective } from '../../shared/helpers/time-picker/time-picker.directive';
import { EventService } from '../../shared/packages/agenda-package/event.service';
import { SharedModule } from '../../shared/shared.module';
import { EventsResolver } from './events.resolver';

const routes: Routes = [
    {
        path: '',
        component: AgendaComponent,
        resolve: { events: EventsResolver}
    }
];

@NgModule({
    imports: [
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyB-BrPkD0ga0o1M1tyDaQN6GDIGylvscEs'
        }),
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [
        AgendaComponent,
        EventRowComponent,
        EventDetailComponent,
        PublicComponent,
        AdminComponent,
        TimePickerComponent,
        TimePickerDirective,
    ],
    providers: [ EventService, EventsResolver, DatePipe ]
})
export class AgendaModule {}
