import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ScrollingService {
    private _scrollPosition: BehaviorSubject<number> = new BehaviorSubject<number>(null);

    get scrollPosition(): BehaviorSubject<number> {
        return this._scrollPosition;
    }

    setScrollPosition(position: number) {
        this._scrollPosition.next(position);
    }
}
