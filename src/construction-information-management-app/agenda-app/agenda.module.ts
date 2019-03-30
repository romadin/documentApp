import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
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
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [AgendaComponent],
    providers: [ EventService, EventsResolver ]
})
export class AgendaModule {}
