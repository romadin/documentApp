import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiAuthResponse } from '../../construction-information-management-app/authenticate-app/interfaces/api-auth.interface';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {
    private token: ApiAuthResponse;
    private APIURL = environment.APIURL;
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public postAuthenticate(path: string, body: any): Observable<ApiAuthResponse> {
        return this.http.post(this.APIURL + path, body).pipe(map(response => this.token = <ApiAuthResponse>response ));
    }

    public post(path: string, body: any): Observable<any> {
        return this.http.post(this.APIURL + path, body, { params: { token: this.token.token, format: 'json' }});
    }

    public get(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params );

        return this.http.get(this.APIURL + path, paramObject );
    }

    public delete(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params );

        return this.http.delete(this.APIURL + path, params);
    }

    public tokenExist(): boolean {
        return this.token !== undefined;
    }
}
