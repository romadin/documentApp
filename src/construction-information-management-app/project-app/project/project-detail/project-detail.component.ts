import {
    animateChild,
    query,
    stagger,
    transition,
    trigger,
    useAnimation
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { initialAnimation, scaleDownAnimation } from '../../../../shared/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WorkFunction } from '../../../../shared/packages/work-function-package/work-function.model';
import { map } from 'rxjs/operators';

@Component({
    selector: 'cim-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.css'],
    animations: [
        trigger('fadeIn', [
            transition('void => *', [
                query('@items', stagger(120, animateChild()), { optional: true })
            ]),
        ]),
        trigger('items', [
            transition('void => *', [
                useAnimation(initialAnimation)
            ]),
            transition('* => void', [
                useAnimation(scaleDownAnimation)
            ])
        ])
    ]
})

export class ProjectDetailComponent implements OnInit {
    public workFunction$: Observable<WorkFunction>;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.workFunction$ = this.route.parent.snapshot.data.project.workFunctions.pipe(
            map((ws: WorkFunction[] ) =>  {
                return ws.find(w => w.isMainFunction);
            }),
        );
    }
}
