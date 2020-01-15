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
    constructor() { }
    
    ngOnInit() {
    }
}
