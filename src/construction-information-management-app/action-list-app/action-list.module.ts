import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ActionListComponent } from './action-list.component';
import { SharedModule } from '../../shared/shared.module';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ActionsArchivedComponent } from './actions-archived/actions-archived.component';
import { ActionDetailPublicComponent } from './item-detail/action-detail-public/action-detail-public.component';

const routes: Routes = [
    {
        path: '',
        component: ActionListComponent,
        data: { breadcrumb: 'Acties' }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ],
    declarations: [
        ActionListComponent,
        ItemDetailComponent,
        ActionsArchivedComponent,
        ActionDetailPublicComponent,
    ],
})

export class ActionListModule { }
