import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface ContextPosition {
    top: number;
    left: number;
}

@Injectable()
export class ContextMenuService {
    toggleMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    delete: Subject<boolean> = new Subject<boolean>();
    private _position: ContextPosition;

    get position(): ContextPosition {
        return this._position;
    }

    set position(position: ContextPosition) {
        this._position = position;
    }
}
