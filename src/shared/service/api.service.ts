import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiAuthResponse } from '../../construction-information-management-app/login-app/interfaces/api-auth.interface';
import { environment } from '../../environments/environment';
import { User } from '../packages/user-package/user.model';

@Injectable()
export class ApiService {
    private token: ApiAuthResponse;
    private API_URL = environment.API_URL;

    constructor(private http: HttpClient) {
        const user: User = JSON.parse(sessionStorage.getItem('currentUser'));
        if ( sessionStorage.getItem('token') && user ) {
            this.token = {
                token: sessionStorage.getItem('token'),
                user_id: user.id,
            };
        }
    }

    public postAuthenticate(path: string, body: any, params: any): Observable<ApiAuthResponse> {
        const paramObject = {params: params};
        return this.http.post(this.API_URL + path, body, paramObject).pipe(map((response) => {
            return this.token = <ApiAuthResponse>response;
        }));
    }

    public noTokenPost(path: string, body, params?: any ): Observable<any> {
        return this.http.post( this.API_URL + path, body, params);
    }

    public post(path: string, body: any, params?: any): Observable<any> {
        const paramObject = { params: { token: this.token.token, format: 'json'}};
        if ( params ) {
            Object.assign( paramObject.params, params );
        }

        return this.http.post(this.API_URL + path, body, paramObject);
    }

    public postInterface<T>(path: string, body: any, params?: any): Observable<any> {
        const paramObject = { params: { token: this.token.token, format: 'json'}};
        if ( params ) {
            Object.assign( paramObject.params, params );
        }

        return this.http.post<T>(this.API_URL + path, body, paramObject);
    }

    public get(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params );

        return this.http.get(this.API_URL + path, paramObject );
    }

    public getInterface<T>(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params );

        return this.http.get<T>(this.API_URL + path, paramObject );
    }


    public noTokenGet(path: string, params: any): Observable<any> {
        const paramObject = {params: params};
        return this.http.get(this.API_URL + path, paramObject );
    }

    public getBlobNoToken(path: string, params: any): Observable<any> {
        return this.http.get(this.API_URL + path, { params: params, responseType: 'blob' } );
    }

    public getBlob(path: string, params: any): Observable<any> {
        return this.http.get(this.API_URL + path, { params: { token: this.token.token, format: 'json'}, responseType: 'blob' } );
    }

    public delete(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params);

        return this.http.delete(this.API_URL + path, paramObject);
    }

    public tokenExist(): boolean {
        return this.token !== undefined;
    }
}
