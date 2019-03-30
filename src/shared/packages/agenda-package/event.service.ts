import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Event } from './event.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface GetParams {
    projectId: number;
}

interface EventApiResponse {
    id: number;
    name: string;
    description: string;
    projectId: number;
    startDate: Date;
    endDate: Date;
}

@Injectable()
export class EventService {

    constructor(private apiService: ApiService) {  }

    getEvents(projectId: number): Observable<Event[]> {
        const params: GetParams = { projectId: projectId };
        const events: Event[] = [];
        return this.apiService.get('/events', params).pipe(map((eventsResponse: EventApiResponse[]) => {
            eventsResponse.forEach((event) => { events.push(this.makeEvent(event)); });
            return events;
        }));
    }

    makeEvent(apiData: EventApiResponse): Event {
        const event = new Event();
        event.id = apiData.id;
        event.name = apiData.name;
        event.description = apiData.description;
        event.projectId = apiData.projectId;
        event.startDate = apiData.startDate;
        event.endDate = apiData.endDate;

        return event;
    }
}
