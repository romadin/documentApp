import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HeadlineService } from '../../../../../shared/packages/headline-package/headline.service';
import { ToastService } from '../../../../../shared/toast.service';
import { Headline } from '../../../../../shared/packages/headline-package/headline.model';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';

@Component({
  selector: 'cim-headline-edit',
  templateUrl: './headline-edit.component.html',
  styleUrls: ['./headline-edit.component.css']
})
export class HeadlineEditComponent implements OnInit {
    @Input() workFunction: WorkFunction;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();

    headlineForm: FormGroup = new FormGroup({
        name: new FormControl('')
    });
    private _headline: Headline;

    constructor(private headlineService: HeadlineService, private toast: ToastService) { }

    ngOnInit() {
    }

    @Input()
    set headline(headline: Headline) {
        this._headline = headline;
        if (headline) {
            this.setFormValue();
        }
    }

    get headline(): Headline {
        return this._headline;
    }

    onSubmit(): void {
        const body = { name: this.headlineForm.controls.name.value };
        if (!this.headlineForm.invalid) {
            if (this.headline && this.headline.name !== this.headlineForm.controls.name.value) {
                this.headlineService.updateHeadline(body, this.headline, this.workFunction).subscribe(headline => {
                    this.headline = headline;
                    this.toast.showSuccess('Gebruiker: ' +  headline.name + ' is bewerkt', 'Bewerkt');
                });
            } else if (this.headline === undefined) {
                this.headlineService.createHeadline(body, this.workFunction).subscribe(headline => {
                    this.workFunction.headlines.push(headline);
                    this.headline = headline;
                    this.toast.showSuccess('Functie: ' +  headline.name + ' is toegevoegd', 'Toegevoegd');
                });
            }
        }
    }

    onCloseView(e: Event): void {
        e.preventDefault();
        this.closeView.emit(true);
    }

    private setFormValue() {
        this.headlineForm.controls.name.setValue(this.headline.name);
    }

}
