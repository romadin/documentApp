import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { EventService } from '../../shared/packages/agenda-package/event.service';
import { SharedModule } from '../../shared/shared.module';
import { EventsResolver } from './events.resolver';
import { EventRowComponent } from './agenda/event-row/event-row.component';
import { EventDetailComponent } from './agenda/event-detail/event-detail.component';
import { AgmCoreModule } from '@agm/core';
import { PublicComponent } from './agenda/event-detail/public/public.component';
import { AdminComponent } from './agenda/event-detail/admin/admin.component';

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
    declarations: [AgendaComponent, EventRowComponent, EventDetailComponent, PublicComponent, AdminComponent],
    providers: [ EventService, EventsResolver ]
})
export class AgendaModule {}
