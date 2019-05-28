import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Headline } from '../../../../../shared/packages/headline-package/headline.model';
import { WorkFunction } from '../../../../../shared/packages/work-function-package/work-function.model';
import { WorkFunctionUpdateBody } from '../../../../../shared/packages/work-function-package/interface/work-function-api-response.interface';
import { WorkFunctionService } from '../../../../../shared/packages/work-function-package/work-function.service';
import { forkJoin } from 'rxjs';
import { HeadlineService } from '../../../../../shared/packages/headline-package/headline.service';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../../../../shared/toast.service';

@Component({
    selector: 'cim-headline-list',
    templateUrl: './headline-list.component.html',
    styleUrls: ['./headline-list.component.css'],
    animations: [
        trigger('toggleInView', [
            transition('void => *', [
                style({ opacity: '0'}),
                animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', style({ opacity: '1'})),
            ]),
            transition('* => void', [
                animate('250ms cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
                    style({ opacity: '0'})
                ])),
            ])
        ])
    ]
})
export class HeadlineListComponent implements OnInit {
    @Input() workFunction: WorkFunction;
    @Output() closeView: EventEmitter<boolean> = new EventEmitter<boolean>();
    headlines: Headline[];
    headlineSelected;

    constructor(
        private workFunctionService: WorkFunctionService,
        private headlineService: HeadlineService,
        private toast: ToastService) { }

    ngOnInit() {
        const workFunctions = this.workFunction.template.workFunctions.filter(w => w.id !== this.workFunction.id);
        const observables = [];
        workFunctions.forEach((workFunction) => observables.push(this.headlineService.getHeadlinesByWorkFunction(workFunction)));
        forkJoin(observables).subscribe((headlinesContainer: Headline[][]) => {
            this.headlines = [];
            headlinesContainer.forEach(headline => this.headlines = this.headlines.concat(headline));
            this.filterExistingHeadlines();
        });
    }
    submit(e: Event): void {
        e.preventDefault();
        if (this.headlineSelected && this.headlineSelected.length > 0) {
            const body: WorkFunctionUpdateBody = {
                headlines: this.headlineSelected
            };
            const message = this.headlineSelected.length === 1 ?
                'Kop: ' + this.headlines.find(h => h.id === this.headlineSelected[0]).name + ' is toegevoegd' : 'De koppen zijn toegevoegd';
            this.workFunctionService.updateWorkFunction(this.workFunction, body).subscribe(() => {
                this.toast.showSuccess(message, 'Toegevoegd');
                this.onCloseView(e);
            });
        }
    }
    onCloseView(e: Event): void {
        e.stopPropagation();
        e.preventDefault();
        this.closeView.emit(true);
    }
    private filterExistingHeadlines(): void {
        // remove duplicates
        this.headlines = this.headlines.filter((chapters, pos) => {
            const index = this.headlines.findIndex(c => c.id === chapters.id);
            return index === pos;
        });

        const headlines: Headline[] = this.workFunction.headlines.getValue();

        // remove already linked chapters
        headlines.map((currentHeadline) => {
            const index = this.headlines.findIndex(newHeadline => newHeadline.id === currentHeadline.id);
            if (index !== -1) {
                this.headlines.splice(index, 1);
            }
        });
    }
}
