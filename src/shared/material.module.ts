import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
} from '@angular/material';

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
    ]
})
export class MaterialModule { }
