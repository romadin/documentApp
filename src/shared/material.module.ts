import { NgModule } from '@angular/core';
import {
    MAT_TOOLTIP_DEFAULT_OPTIONS,
    MatAutocompleteModule,
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
    MatToolbarModule, MatTooltipDefaultOptions, MatTooltipModule,
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';


export const myCustomTooltipDefaults = {
    matTooltipClass: 'tooltip'
};

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
        MatAutocompleteModule,
        DragDropModule,
        MatTooltipModule
    ],
    providers: [
        {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}
    ],
})
export class MaterialModule { }
