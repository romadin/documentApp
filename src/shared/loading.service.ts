import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class LoadingService {
    private _isLoading: Subject<boolean> = new Subject();

    get isLoading(): Subject<boolean> {
        return this._isLoading;
    }
}
