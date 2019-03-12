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
    private APIURL = environment.APIURL;
    private http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;

        const user: User = JSON.parse(sessionStorage.getItem('currentUser'));
        if ( sessionStorage.getItem('token') && user ) {
            this.token = {
                token: sessionStorage.getItem('token'),
                user_id: user.id,
            };
        }
    }

    public postAuthenticate(path: string, body: any): Observable<ApiAuthResponse> {
        return this.http.post(this.APIURL + path, body).pipe(map(response => this.token = <ApiAuthResponse>response ));
    }

    public noTokenPost(path: string, body, params?: any ): Observable<any> {
        return this.http.post( this.APIURL + path, body, params);
    }

    public post(path: string, body: any, params?: any): Observable<any> {
        const paramObject = { params: { token: this.token.token, format: 'json'}};
        if ( params ) {
            Object.assign( paramObject.params, params );
        }

        return this.http.post(this.APIURL + path, body, paramObject);
    }

    public get(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params );

        return this.http.get(this.APIURL + path, paramObject );
    }

    public noTokenGet(path: string, params: any): Observable<any> {
        return this.http.get(this.APIURL + path, params );
    }

    public getBlob(path: string, params: any): Observable<any> {
        return this.http.get(this.APIURL + path, { params: { token: this.token.token, format: 'json'}, responseType: 'blob' } );
    }

    public delete(path: string, params: any): Observable<any> {
        const paramObject = { params: { token: this.token.token }};
        Object.assign( paramObject.params, params);

        return this.http.delete(this.APIURL + path, paramObject);
    }

    public tokenExist(): boolean {
        return this.token !== undefined;
    }
}
