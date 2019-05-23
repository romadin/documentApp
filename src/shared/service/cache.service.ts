import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { ApiService } from './api.service';

export type CacheItemName = 'cacheChaptersWorkFunction' | 'cacheChaptersHeadline';

export interface CacheItem {
    id: number;
    hash: string;
    items?: any[];
}

interface CacheParent {
    [id: number]: CacheItem;
}
interface CacheContainer {
    [name: string]: CacheItem | CacheParent;
}

interface CacheGetParam {
    name?: string;
    url?: string;
    options?: any;
    hash?: string;
}

@Injectable()
export class CacheService {
    cacheContainer: CacheContainer = {};
    private path = '/cache';

    constructor(private apiService: ApiService) {  }

    get(cacheItemName: CacheItemName, path: string, param: any, parent?: number): Observable<any> {
        let cacheItem;
        if (parent && this.cacheContainer[cacheItemName]) {
            cacheItem = this.cacheContainer[cacheItemName][parent];
        } else {
            cacheItem = this.cacheContainer[cacheItemName];
        }

        if (cacheItem) {
            return this.checkCacheHash(cacheItem).pipe(
                mergeMap( (hasSameHash) => {
                    return hasSameHash ? of(cacheItem.items) : this.apiService.get(path, param);
                })
            );
        }

        const getParam: CacheGetParam = {
            name: cacheItemName,
            url: path,
        };
        return this.getCacheItem(getParam).pipe(
            mergeMap((cachedItem: CacheItem) =>  {
                if (!this.cacheContainer) {
                    this.cacheContainer = {};
                }
                if (parent) {
                    if (!this.cacheContainer[cacheItemName]) {
                        this.cacheContainer[cacheItemName] = {};
                    }
                    this.cacheContainer[cacheItemName][parent] = cachedItem;
                } else {
                    this.cacheContainer[cacheItemName] = cachedItem;
                }
                return this.apiService.get(path, param);
            }),
        );
    }

    post(path: string, body: any, params: any, cacheItem: CacheItem): Observable<any> {
        return this.updateCacheHash(cacheItem.id).pipe(
            mergeMap(v => this.apiService.post(path, body, params))
        );
    }

    delete(path: string, params: any): Observable<any> {
        return this.apiService.delete(path, params);
    }

    private checkCacheHash(cacheItem: CacheItem): Observable<boolean> {
        const param: CacheGetParam = { hash: cacheItem.hash };
        return this.apiService.get(this.path + '/' + cacheItem.id, param).pipe(
            map(result => result.sameHash )
        );
    }

    private getCacheItem(body: CacheGetParam): Observable<CacheItem> {
        return this.apiService.get(this.path, body).pipe(
            map(result => {
                return <CacheItem>{
                    id: result.id,
                    hash: result.hash,
                };
            })
        );
    }

    private updateCacheHash(cacheId: number) {
        return this.apiService.post(this.path + '/' + cacheId, {}).pipe(
            map(result => {
                return <CacheItem>{
                    id: result.id,
                    hash: result.hash,
                };
            })
        );
    }
}
