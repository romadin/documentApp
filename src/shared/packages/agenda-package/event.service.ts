import { Injectable } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Event } from './event.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

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
    description?: string;
    projectId: number;
    startDate: ApiDate;
    endDate: ApiDate;
    location?: EventLocation;
}

export interface EventLocation {
    streetName: string;
    zipCode: string;
    residence: string;
}

export interface EventPostData {
    name?: string;
    projectId?: number;
    description?: string;
    startDate?: string;
    endDate?: string;
    location?: string;
}

interface EventCache {
    [id: number]: Event;
}
@Injectable()
export class EventService {
    readonly eventsEndpoint = '/events';
    private eventCache: EventCache = {};

    constructor(private apiService: ApiService, private datePipe: DatePipe) {  }

    getEvents(projectId: number): Observable<Event[]> {
        const params: GetParams = { projectId: projectId };
        return this.apiService.get(this.eventsEndpoint, params).pipe(map((eventsResponse: EventApiResponse[]) => {
            const events: Event[] = [];
            eventsResponse.forEach((event) => { events.push(this.makeEvent(event)); });
            return events;
        }));
    }

    createEvent(event: Event): Observable<Event> {
        const body = this.createPostDataFromEvent(event);
        return this.apiService.post(this.eventsEndpoint, body).pipe(map((eventsResponse: EventApiResponse) => {
            return this.makeEvent(eventsResponse);
        }));
    }

    editEvent(event: Event): Observable<Event> {
        if (this.eventCache[event.id]) {
            return of(this.eventCache[event.id]);
        }
        const body = this.createPostDataFromEvent(event);
        return this.apiService.post(this.eventsEndpoint + '/' + event.id, body).pipe(map((eventsResponse: EventApiResponse) => {
            return this.makeEvent(eventsResponse);
        }));
    }

    deleteEvent(event: Event): Observable<Event> {
        return this.apiService.delete(this.eventsEndpoint + '/' + event.id, {}).pipe(map(response => {
            console.log(response);
            return response;
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
        event.location = apiData.location;
        return event;
    }

    private createPostDataFromEvent(event: Event): EventPostData {
        return {
            name: event.name,
            projectId: event.projectId,
            description: event.description,
            startDate: this.datePipe.transform(event.startDate, 'yyyy-MM-dd, HH:mm:ss'),
            endDate: this.datePipe.transform(event.endDate, 'yyyy-MM-dd, HH:mm:ss'),
            location: JSON.stringify(event.location),
        };
    }
}
