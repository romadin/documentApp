import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class RouterService {
    backRoute: Subject<string> = new Subject();


}
