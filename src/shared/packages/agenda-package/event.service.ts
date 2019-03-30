import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Event } from './event.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface GetParams {
    projectId: number;
}
interface ApiDate {
    date: string;
    timezone_type: number;
    timezone: string;
}

interface EventApiResponse {
    id: number;
    name: string;
    description: string;
    projectId: number;
    startDate: ApiDate;
    endDate: ApiDate;
}

@Injectable()
export class EventService {

    constructor(private apiService: ApiService) {  }

    getEvents(projectId: number): Observable<Event[]> {
        const params: GetParams = { projectId: projectId };
        return this.apiService.get('/events', params).pipe(map((eventsResponse: EventApiResponse[]) => {
            const events: Event[] = [];
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
        event.startDate = new Date(apiData.startDate.date);
        event.endDate = new Date(apiData.endDate.date);
        return event;
    }
}
