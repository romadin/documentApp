import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule, MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule, MatNativeDateModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
    exports: [
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatToolbarModule,
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatMenuModule,
        MatSelectModule,
        MatOptionModule,
        MatListModule,
        MatExpansionModule,
        MatTableModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        DragDropModule,
    ]
})
export class MaterialModule { }
