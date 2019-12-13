import {
    animation, trigger, animateChild, group,
    transition, animate, style, query
} from '@angular/animations';

export const initialAnimation = animation([
    style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
    animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
        style({ transform: 'scale(1)', opacity: 1 })
    )  // final
]);

export const scaleDownAnimation = animation([
    style({ transform: 'scale(1)', opacity: 1, height: '*' }),
    animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
        style({
            transform: 'scale(0.5)', opacity: 0,
            height: '0px', margin: '0px'
        })
    )
]);
